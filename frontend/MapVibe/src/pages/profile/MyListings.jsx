import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { showConfirmToast } from "../../components/common/ConfirmToast";
import { getApiErrorMessage } from "../../utils/error";
import locationService from "../../services/locationService";
import ListingItem from "../../components/listing/ListingItem";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusSelect from "../../components/select/StatusSelect";

const STATUS_LABELS = {
  ALL: "All Listings",
  ACTIVE: "Active",
  PENDING: "Pending Review",
  REJECTED: "Rejected",
  INACTIVE: "Inactive",
};

const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [deletingId, setDeletingId] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 6,
  });

  const fetchListings = async (page = 1, status = selectedStatus) => {
    try {
      setLoading(true);

      const result = await locationService.getMyListings({
        page,
        ...(status !== "ALL" ? { status } : {}),
      });

      setListings(result.data);
      setPagination(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(1, "ALL");
  }, []);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    fetchListings(1, status);
  };

  const handlePageChange = (page) => {
    fetchListings(page, selectedStatus);
  };

  const handleEdit = (id) => {
    navigate(`/listings/${id}/edit`);
  };

  const handleDelete = (id) => {
    if (deletingId !== null) {
      return;
    }

    showConfirmToast({
      message: "Are you sure you want to delete this listing?",
      onConfirm: async () => {
        try {
          setDeletingId(id);
          await locationService.deleteLocation(id);

          const pageToLoad =
            listings.length === 1 && pagination.currentPage > 1
              ? pagination.currentPage - 1
              : pagination.currentPage;

          await fetchListings(pageToLoad);
          toast.success("Listing deleted successfully.");
        } catch (error) {
          toast.error(getApiErrorMessage(error, "Failed to delete listing."));
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const getActions = (listing) => {
    const status = listing.status?.toUpperCase();

    const actions = [];

    if (["ACTIVE", "PENDING", "REJECTED"].includes(status)) {
      actions.push({
        icon: "sl-icon-note",
        label: "Edit",
        onClick: () => handleEdit(listing.id),
        disabled: deletingId === listing.id,
      });
    }

    actions.push({
      icon: "sl-icon-close",
      label: deletingId === listing.id ? "Deleting..." : "Delete",
      onClick: () => handleDelete(listing.id),
      disabled: deletingId === listing.id,
    });

    return actions;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="margin-bottom-65">
      <div id="titlebar" className="gradient">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>My Listings ({pagination.totalElements})</h2>
              <nav id="breadcrumbs">
                <ul>
                  <Link to="/">Home</Link>
                  <li>My Listings</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row sticky-wrapper">
          <div className="col-lg-12 col-md-12">
            <div className="row margin-bottom-25">
              <div className="col-md-6 col-xs-6"></div>

              <div className="col-md-6 col-xs-6">
                <div className="sort-by">
                  <div className="sort-by-select">
                    <StatusSelect
                      value={selectedStatus}
                      onChange={handleStatusChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {listings.length === 0 ? (
              <div className="notification notice large">
                {selectedStatus === "ALL" ? (
                  <>
                    <h4>You haven't added any listings yet.</h4>
                    <p>
                      Start sharing amazing places with the community by
                      creating your first listing.
                    </p>
                  </>
                ) : (
                  <>
                    <h4>
                      No {STATUS_LABELS[selectedStatus] ?? selectedStatus}{" "}
                      listings found.
                    </h4>
                    <p>
                      There are no listings matching this status. Try selecting
                      another status.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="dashboard-list-box margin-top-0 shadow">
                <h4>
                  {selectedStatus === "ALL"
                    ? "All Listings"
                    : `${STATUS_LABELS[selectedStatus] ?? selectedStatus} Listings`}
                </h4>

                <ul>
                  {listings.map((listing) => (
                    <ListingItem
                      key={listing.id}
                      listing={listing}
                      actions={getActions(listing)}
                      status={listing.status}
                    />
                  ))}
                </ul>
              </div>
            )}
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
      </div>
    </div>
  );
};

export default MyListings;
