import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { mapLocationToFormData } from "../../../utils/listingFormMapper";
import adminService from "../../../services/adminService";
import ListingBasicInformation from "../../listings/listing-form/components/ListingBasicInformation";
import ListingLocation from "../../listings/listing-form/components/ListingLocation";
import ListingGallery from "../../listings/listing-form/components/ListingGallery";
import ListingDetails from "../../listings/listing-form/components/ListingDetails";
import OpeningHours from "../../listings/listing-form/components/OpeningHours";
import ListingPricing from "../../listings/listing-form/components/ListingPricing";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const AdminListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const result = await adminService.getListing(id);
        setListing(result);
        setFormData(mapLocationToFormData(result));
        setSelectedCategory(result.category || null);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin địa điểm.");
        navigate("/admin/listings/active", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate]);

  const handleApprove = async () => {
    if (processing) return;

    try {
      setProcessing(true);
      const updatedListing = await adminService.approveListing(id);
      setListing(updatedListing);
      toast.success("Listing approved successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể duyệt listing.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (processing) return;

    try {
      setProcessing(true);
      const updatedListing = await adminService.rejectListing(id);
      setListing(updatedListing);
      toast.success("Listing rejected successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể từ chối listing.",
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDeactivate = async () => {
    if (processing) return;

    try {
      setProcessing(true);
      const updatedListing = await adminService.deactivateListing(id);
      setListing(updatedListing);
      toast.success("Listing deactivated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể ẩn listing.");
    } finally {
      setProcessing(null);
    }
  };

  const handleReactivate = async () => {
    if (processing) return;

    try {
      setProcessing(true);
      const updatedListing = await adminService.reactivateListing(id);
      setListing(updatedListing);
      toast.success("Listing reactivated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể khôi phục listing.",
      );
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!listing || !formData) {
    return null;
  }

  return (
    <>
      <div id="titlebar">
        <div className="row">
          <div className="col-md-12">
            <h2>Listing</h2>
            <nav id="breadcrumbs">
              <ul>
                <li>
                  <Link to="/admin">Dashboard</Link>
                </li>
                <li>Listing</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div id="add-listing" className="separated-form">
            <div className="admin-readonly-interaction">
              <ListingBasicInformation
                formData={formData}
                selectedCategory={selectedCategory}
              />
            </div>

            <ListingLocation formData={formData} readOnly />

            <div className="admin-readonly-interaction">
              <ListingGallery images={formData.images} />
            </div>

            <div className="admin-readonly-interaction">
              <ListingDetails formData={formData} />
            </div>

            <OpeningHours value={formData.openingHours} readOnly />

            <ListingPricing formData={formData} readOnly />

            {listing.status === "PENDING" && (
              <>
                <button
                  type="button"
                  className="button preview"
                  onClick={handleApprove}
                  disabled={processing}
                >
                  Approve Listing <i className="fa fa-check"></i>
                </button>
                <button
                  type="button"
                  className="button preview"
                  onClick={handleReject}
                  disabled={processing}
                >
                  Reject Listing <i className="fa fa-close"></i>
                </button>
              </>
            )}

            {listing.status === "ACTIVE" && (
              <>
                <button
                  type="button"
                  className="button preview"
                  onClick={() => navigate(`/listings/${listing.id}/edit`)}
                >
                  Edit Listing <i className="fa fa-pencil"></i>
                </button>
                <button
                  type="button"
                  className="button preview"
                  onClick={handleDeactivate}
                  disabled={processing}
                >
                  Deactivate Listing <i className="fa fa-power-off"></i>
                </button>
              </>
            )}

            {listing.status === "INACTIVE" && (
              <button
                type="button"
                className="button preview"
                onClick={handleReactivate}
                disabled={processing}
              >
                Reactivate Listing <i className="fa fa-check"></i>
              </button>
            )}

            {listing.status === "REJECTED" && (
              <div className="notification error margin-top-45">
                <p>This listing has been rejected.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminListingDetailPage;
