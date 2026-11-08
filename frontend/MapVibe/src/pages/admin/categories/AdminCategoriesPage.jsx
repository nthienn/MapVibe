import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils/date";
import { showConfirmToast } from "../../../components/common/ConfirmToast";
import { getApiErrorMessage } from "../../../utils/error";
import categoryService from "../../../services/categoryService";
import CategoryFormModal from "./CategoryFormModal";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import Pagination from "../../../components/common/Pagination";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 6,
  });

  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);
      const result = await categoryService.getAdminCategories({ page });
      setCategories(result.data);
      setPagination(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePageChange = (page) => {
    fetchCategories(page);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (category) => {
    if (deletingCategoryId !== null) {
      return;
    }

    showConfirmToast({
      message: `Are you sure you want to delete "${category.name}"?`,

      onConfirm: async () => {
        try {
          setDeletingCategoryId(category.id);
          await categoryService.deleteCategory(category.id);

          const pageToLoad =
            categories.length === 1 && pagination.currentPage > 1
              ? pagination.currentPage - 1
              : pagination.currentPage;

          await fetchCategories(pageToLoad);
          toast.success("Category deleted successfully.");
        } catch (error) {
          toast.error(
            getApiErrorMessage(
              error,
              "Failed to delete category. It may still be used by listings.",
            ),
          );
        } finally {
          setDeletingCategoryId(null);
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
            <h2>Categories ({pagination.totalElements})</h2>
            <nav id="breadcrumbs">
              <ul>
                <li>
                  <Link to="/admin">Dashboard</Link>
                </li>
                <li>Categories</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="dashboard-list-box margin-top-0">
            <h4>Category Configuration</h4>

            {categories.length === 0 ? (
              <div className="notification notice">
                <p>No categories found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="basic-table">
                  <thead>
                    <tr>
                      <th>Icon</th>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td>
                          <i className={category.icon} aria-hidden="true" />
                        </td>

                        <td>{category.name}</td>

                        <td>{category.slug}</td>

                        <td>{formatDate(category.createdAt)}</td>

                        <td>
                          <div className="button-group">
                            <button
                              type="button"
                              className="button gray"
                              onClick={() => openEditModal(category)}
                            >
                              <i className="sl sl-icon-pencil" /> Edit
                            </button>

                            <button
                              type="button"
                              className="button gray"
                              disabled={deletingCategoryId !== null}
                              onClick={() => handleDeleteCategory(category)}
                            >
                              <i className="sl sl-icon-trash" />
                              {deletingCategoryId === category.id
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
              <i className="sl sl-icon-plus" /> Add Category
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

      <CategoryFormModal
        isOpen={isModalOpen}
        category={editingCategory}
        onClose={closeModal}
        onSaved={fetchCategories}
      />
    </>
  );
};

export default AdminCategoriesPage;
