import { useEffect, useRef } from "react";
import mapvinagl from "mapvina-gl";
import "mapvina-gl/dist/mapvina-gl.css";

const DEFAULT_CENTER = {
  lat: 16.0544,
  lng: 108.2022,
};

const DEFAULT_ZOOM = 4;
const LOCATION_ZOOM = 16;
const PROVINCE_ZOOM = 11;

const MapPicker = ({
  latitude = null,
  longitude = null,
  centerLatitude = null,
  centerLongitude = null,
  onChange,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const hasCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined;

  const initialZoom = hasCoordinates ? LOCATION_ZOOM : DEFAULT_ZOOM;

  const getCoordinates = () => {
    return hasCoordinates
      ? {
          lng: Number(longitude),
          lat: Number(latitude),
        }
      : DEFAULT_CENTER;
  };

  const handleCoordinateChange = (lng, lat) => {
    onChange?.({
      latitude: lat,
      longitude: lng,
    });
  };

  const createMarker = (lng, lat) => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = new mapvinagl.Marker({
      draggable: true,
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    markerRef.current.on("dragend", () => {
      const { lng, lat } = markerRef.current.getLngLat();

      handleCoordinateChange(lng, lat);
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const { lng, lat } = getCoordinates();

    const map = new mapvinagl.Map({
      container: mapContainerRef.current,
      style: `https://maps.mapvina.com/styles/v2/streets.json?key=${
        import.meta.env.VITE_MAPVINA_KEY
      }`,
      center: {
        lng,
        lat,
      },
      zoom: initialZoom,
    });

    mapRef.current = map;

    map.addControl(
      new mapvinagl.NavigationControl({
        showZoom: true,
        showCompass: false,
      }),
      "top-right",
    );

    map.on("click", (event) => {
      const { lng, lat } = event.lngLat;

      createMarker(lng, lat);
      handleCoordinateChange(lng, lat);
    });

    if (hasCoordinates) {
      createMarker(lng, lat);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!hasCoordinates) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      return;
    }

    const lng = Number(longitude);
    const lat = Number(latitude);

    if (Number.isNaN(lng) || Number.isNaN(lat)) return;

    if (!markerRef.current) {
      createMarker(lng, lat);
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: LOCATION_ZOOM,
      duration: 800,
    });
  }, [latitude, longitude]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (
      centerLatitude === null ||
      centerLatitude === undefined ||
      centerLongitude === null ||
      centerLongitude === undefined
    ) {
      return;
    }

    const lng = Number(centerLongitude);
    const lat = Number(centerLatitude);

    if (Number.isNaN(lng) || Number.isNaN(lat)) {
      return;
    }

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: PROVINCE_ZOOM,
      duration: 800,
    });
  }, [centerLatitude, centerLongitude]);

  return (
    <div ref={mapContainerRef} className="map-picker" id="singleListingMap" />
  );
};

export default MapPicker;
