import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import adminService from "../../../services/adminService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ListingItem from "../../../components/listing/ListingItem";
import Pagination from "../../../components/common/Pagination";

const AdminListingsPage = ({ status, title }) => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 6,
  });

  const fetchListings = async (page = 1) => {
    try {
      setLoading(true);
      const result = await adminService.getListings(status, page);
      setListings(result.data);
      setPagination(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (processingId !== null) {
      return;
    }

    try {
      setProcessingId(id);
      await adminService.approveListing(id);
      await reloadAfterStatusChange();
      toast.success("Listing approved successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể duyệt listing.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (processingId !== null) {
      return;
    }

    try {
      setProcessingId(id);
      await adminService.rejectListing(id);
      await reloadAfterStatusChange();
      toast.success("Listing rejected successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể từ chối listing.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeactivate = async (id) => {
    if (processingId !== null) {
      return;
    }

    try {
      setProcessingId(id);
      await adminService.deactivateListing(id);
      await reloadAfterStatusChange();
      toast.success("Listing deactivated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể ẩn listing.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReactivate = async (id) => {
    if (processingId !== null) {
      return;
    }

    try {
      setProcessingId(id);
      await adminService.reactivateListing(id);
      await reloadAfterStatusChange();
      toast.success("Listing reactivated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể khôi phục listing.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const reloadAfterStatusChange = async () => {
    const pageToLoad =
      listings.length === 1 && pagination.currentPage > 1
        ? pagination.currentPage - 1
        : pagination.currentPage;

    await fetchListings(pageToLoad);
  };

  useEffect(() => {
    fetchListings(1);
  }, [status]);

  const handlePageChange = (page) => {
    fetchListings(page);
  };

  const getActions = (listing) => {
    const actions = [
      {
        icon: "sl-icon-eye",
        label: "View",
        onClick: () => navigate(`/admin/listings/${listing.id}`),
        disabled: processingId === listing.id,
      },
    ];

    if (status === "PENDING") {
      actions.push(
        {
          icon: "sl-icon-check",
          label: "Approve",
          onClick: () => handleApprove(listing.id),
          disabled: processingId === listing.id,
        },
        {
          icon: "sl-icon-close",
          label: "Reject",
          onClick: () => handleReject(listing.id),
          disabled: processingId === listing.id,
        },
      );
    }

    if (status === "ACTIVE") {
      actions.push(
        {
          icon: "sl-icon-pencil",
          label: "Edit",
          onClick: () => navigate(`/listings/${listing.id}/edit`),
          disabled: processingId === listing.id,
        },
        {
          icon: "sl-icon-power",
          label: "Deactivate",
          onClick: () => handleDeactivate(listing.id),
          disabled: processingId === listing.id,
        },
      );
    }

    if (status === "INACTIVE") {
      actions.push({
        icon: "sl-icon-check",
        label: "Reactivate",
        onClick: () => handleReactivate(listing.id),
        disabled: processingId === listing.id,
      });
    }

    return actions;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div id="titlebar">
        <div className="row">
          <div className="col-md-12">
            <h2>
              {title} ({pagination.totalElements})
            </h2>
            <nav id="breadcrumbs">
              <ul>
                <li>
                  <Link to="/admin">Dashboard</Link>
                </li>
                <li>{title}</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="dashboard-list-box margin-top-0">
            <h4>{title}</h4>

            {listings.length === 0 ? (
              <div className="notification notice">
                <p>No listings found.</p>
              </div>
            ) : (
              <ul>
                {listings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing}
                    detailPath={`/admin/listings/${listing.id}`}
                    actions={getActions(listing)}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>

        {pagination.totalPages > 0 && (
          <div className="col-md-12">
            <div className="pagination-container margin-top-30">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminListingsPage;
