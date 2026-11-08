import { useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "../../../../utils/error";
import administrativeService from "../../../../services/administrativeService";
import mapVinaService from "../../../../services/mapVinaService";
import ChosenSelect from "../../../../components/common/ChosenSelect";
import MapPicker from "../../../../components/map/MapPicker";
import MapView from "../../../../components/map/MapView";

const ListingLocation = ({
  formData,
  onChange,
  onLocationChange,
  onGeocodingLoadingChange,
  serverErrors = [],
  onClearServerError,
  readOnly = false,
}) => {
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardLoading, setWardLoading] = useState(false);
  const [geocodingStatus, setGeocodingStatus] = useState(null);
  const [geocodingError, setGeocodingError] = useState("");
  const locationSearchRequestIdRef = useRef(0);
  const [mapCenter, setMapCenter] = useState(null);

  const getServerError = (field) => {
    return serverErrors.find((error) => error.field === field);
  };

  const addressError = getServerError("address");
  const provinceError = getServerError("provinceCode");
  const wardError = getServerError("wardCode");

  const invalidateLocationSearch = () => {
    locationSearchRequestIdRef.current += 1;
    setGeocodingStatus(null);
    setGeocodingError("");
  };

  useEffect(() => {
    onGeocodingLoadingChange?.(geocodingStatus === "loading");
  }, [geocodingStatus, onGeocodingLoadingChange]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const result = await administrativeService.getProvinces();

        setProvinces(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchWards = async () => {
      if (!formData.provinceCode) {
        setWards([]);
        return;
      }

      try {
        setWardLoading(true);

        const result = await administrativeService.getWards(
          formData.provinceCode,
        );

        setWards(result);
      } catch (error) {
        console.error(error);
        setWards([]);
      } finally {
        setWardLoading(false);
      }
    };

    fetchWards();
  }, [formData.provinceCode]);

  const selectedProvince = provinces.find(
    (province) => province.code === formData.provinceCode,
  );

  const selectedWard = wards.find((ward) => ward.code === formData.wardCode);

  const geocodeLocation = async ({ address, province, ward }) => {
    const trimmedAddress = address?.trim();

    if (!trimmedAddress || !province || !ward) {
      return;
    }

    const requestId = ++locationSearchRequestIdRef.current;

    setGeocodingStatus("loading");
    setGeocodingError("");

    try {
      const result = await mapVinaService.searchCoordinates({
        address: trimmedAddress,
        ward: ward.name,
        province: province.name,
      });

      if (requestId !== locationSearchRequestIdRef.current) {
        return;
      }

      onLocationChange?.({
        latitude: result.latitude,
        longitude: result.longitude,
      });

      setGeocodingStatus("success");
    } catch (error) {
      if (requestId !== locationSearchRequestIdRef.current) {
        return;
      }

      console.error("MapVina geocoding failed:", error);

      setGeocodingStatus("error");
      setGeocodingError(
        getApiErrorMessage(error, "Không thể xác định vị trí từ địa chỉ."),
      );
    }
  };

  const centerMapOnProvince = async (province) => {
    if (!province) {
      setMapCenter(null);
      return;
    }

    const requestId = ++locationSearchRequestIdRef.current;

    try {
      const result = await mapVinaService.searchCoordinates({
        address: "",
        ward: "",
        province: `${province.name}, Vietnam`,
      });

      if (requestId !== locationSearchRequestIdRef.current) {
        return;
      }

      if (!result) {
        return;
      }

      setMapCenter({
        latitude: result.latitude,
        longitude: result.longitude,
      });
    } catch (error) {
      if (requestId !== locationSearchRequestIdRef.current) {
        return;
      }

      console.error("Failed to find province location:", error);
    }
  };

  const handleAddressBlur = () => {
    geocodeLocation({
      address: formData.address,
      province: selectedProvince,
      ward: selectedWard,
    });
  };

  const handleProvinceChange = (province) => {
    invalidateLocationSearch();

    setMapCenter(null);

    onChange({
      target: {
        name: "provinceCode",
        value: province?.code ?? "",
      },
    });

    onChange({
      target: {
        name: "wardCode",
        value: "",
      },
    });

    onLocationChange?.({
      latitude: null,
      longitude: null,
    });

    onClearServerError?.("provinceCode");
    onClearServerError?.("wardCode");

    centerMapOnProvince(province);
  };

  const handleWardChange = (ward) => {
    invalidateLocationSearch();

    onChange({
      target: {
        name: "wardCode",
        value: ward?.code ?? "",
      },
    });

    onLocationChange?.({
      latitude: null,
      longitude: null,
    });

    onClearServerError?.("wardCode");

    if (!formData.address?.trim() || !selectedProvince || !ward) {
      return;
    }

    geocodeLocation({
      address: formData.address,
      province: selectedProvince,
      ward,
    });
  };

  const handleAddressChange = (event) => {
    invalidateLocationSearch();
    onChange(event);
  };

  return (
    <>
      <div className="add-listing-section margin-top-45">
        <div className="add-listing-headline">
          <h3>
            <i className="sl sl-icon-location"></i> Location
          </h3>
        </div>

        <div className="submit-section">
          <div className="row with-forms">
            <div className="col-md-6">
              <h5>Province</h5>

              <ChosenSelect
                options={provinces}
                value={formData.provinceCode || null}
                onChange={handleProvinceChange}
                placeholder="Select Province"
                error={provinceError}
                valueKey="code"
                labelKey="name"
                disabled={readOnly}
              />

              {provinceError && (
                <div className="error-wrapper">
                  <span className="field-error">{provinceError.message}</span>
                </div>
              )}
            </div>

            <div className="col-md-6">
              <h5>Ward</h5>

              <ChosenSelect
                options={wards}
                value={formData.wardCode || null}
                onChange={handleWardChange}
                placeholder={wardLoading ? "Loading wards..." : "Select Ward"}
                error={wardError}
                valueKey="code"
                labelKey="name"
                disabled={readOnly || !formData.provinceCode || wardLoading}
              />

              {wardError && (
                <div className="error-wrapper">
                  <span className="field-error">{wardError.message}</span>
                </div>
              )}
            </div>

            <div className="col-md-12">
              <h5>Address</h5>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleAddressChange}
                onBlur={handleAddressBlur}
                placeholder="e.g. 123 Điện Biên Phủ"
                className={addressError ? "input-error" : ""}
                disabled={readOnly}
              />

              {geocodingStatus === "loading" && (
                <div className="location-geocoding-status">
                  Finding location...
                </div>
              )}

              {geocodingStatus === "success" && (
                <div className="location-geocoding-status success">
                  Location found.
                </div>
              )}

              {geocodingStatus === "error" && (
                <div className="location-geocoding-status error">
                  {geocodingError}
                </div>
              )}

              {addressError && (
                <div className="error-wrapper">
                  <span className="field-error">{addressError.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="add-listing-section margin-top-45">
        <div className="add-listing-headline">
          <h3>
            <i className="sl sl-icon-map"></i> Location on Map
          </h3>
        </div>

        <div className="submit-section">
          <div className="row">
            <div className="col-md-12">
              <div id="singleListingMap-container">
                {readOnly ? (
                  <MapView
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                  />
                ) : (
                  <MapPicker
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    centerLatitude={mapCenter?.latitude}
                    centerLongitude={mapCenter?.longitude}
                    onChange={onLocationChange}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingLocation;
