import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils/date";
import { showConfirmToast } from "../../../components/common/ConfirmToast";
import { getApiErrorMessage } from "../../../utils/error";
import amenityService from "../../../services/amenityService";
import AmenityFormModal from "./AmenityFormModal";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import Pagination from "../../../components/common/Pagination";

const AdminAmenitiesPage = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [deletingAmenityId, setDeletingAmenityId] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 6,
  });

  const fetchAmenities = async (page = 1) => {
    try {
      setLoading(true);
      const result = await amenityService.getAdminAmenities({ page });
      setAmenities(result.data);
      setPagination(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handlePageChange = (page) => {
    fetchAmenities(page);
  };

  const openCreateModal = () => {
    setEditingAmenity(null);
    setIsModalOpen(true);
  };

  const openEditModal = (amenity) => {
    setEditingAmenity(amenity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAmenity(null);
  };

  const handleDeleteAmenity = (amenity) => {
    if (deletingAmenityId !== null) {
      return;
    }

    showConfirmToast({
      message: `Are you sure you want to delete "${amenity.name}"?`,

      onConfirm: async () => {
        try {
          setDeletingAmenityId(amenity.id);
          await amenityService.deleteAmenity(amenity.id);

          const pageToLoad =
            amenities.length === 1 && pagination.currentPage > 1
              ? pagination.currentPage - 1
              : pagination.currentPage;

          await fetchAmenities(pageToLoad);
          toast.success("Amenity deleted successfully.");
        } catch (error) {
          toast.error(
            getApiErrorMessage(
              error,
              "Failed to delete amenity. It may still be used by listings.",
            ),
          );
        } finally {
          setDeletingAmenityId(null);
        }
      },
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div id="titlebar">
        <div className="row">
          <div className="col-md-12">
            <h2>Amenities ({pagination.totalElements})</h2>
            <nav id="breadcrumbs">
              <ul>
                <li>
                  <Link to="/admin">Dashboard</Link>
                </li>
                <li>Amenities</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="dashboard-list-box margin-top-0">
            <h4>Amenity Configuration</h4>

            {amenities.length === 0 ? (
              <div className="notification notice">
                <p>No amenities found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="basic-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {amenities.map((amenity) => (
                      <tr key={amenity.id}>
                        <td>{amenity.name}</td>

                        <td>{formatDate(amenity.createdAt)}</td>

                        <td>
                          <div className="button-group">
                            <button
                              type="button"
                              className="button gray"
                              onClick={() => openEditModal(amenity)}
                            >
                              <i className="sl sl-icon-pencil" /> Edit
                            </button>

                            <button
                              type="button"
                              className="button gray"
                              disabled={deletingAmenityId !== null}
                              onClick={() => handleDeleteAmenity(amenity)}
                            >
                              <i className="sl sl-icon-trash" />
                              {deletingAmenityId === amenity.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="admin-add-button">
            <button type="button" className="button" onClick={openCreateModal}>
              <i className="sl sl-icon-plus" /> Add Amenity
            </button>
          </div>

          {pagination.totalPages > 0 && (
            <div className="row">
              <div className="col-md-12">
                <div className="pagination-container margin-top-30">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AmenityFormModal
        isOpen={isModalOpen}
        amenity={editingAmenity}
        onClose={closeModal}
        onSaved={fetchAmenities}
      />
    </>
  );
};

export default AdminAmenitiesPage;
