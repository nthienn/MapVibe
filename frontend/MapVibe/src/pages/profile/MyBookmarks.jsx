import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import useBookmark from "../../hooks/useBookmark";
import bookmarkService from "../../services/bookmarkService";
import ListingItem from "../../components/listing/ListingItem";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const MyBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 6,
  });

  const fetchBookmarks = async (page = 1) => {
    try {
      setLoading(true);
      const result = await bookmarkService.getMyBookmarks({ page });
      setBookmarks(result.data);
      setPagination(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handlePageChange = (page) => {
    fetchBookmarks(page);
  };

  const { toggleBookmark } = useBookmark();

  const handleRemove = async (locationId) => {
    await toggleBookmark(locationId, async () => {
      const pageToLoad =
        bookmarks.length === 1 && pagination.currentPage > 1
          ? pagination.currentPage - 1
          : pagination.currentPage;

      await fetchBookmarks(pageToLoad);

      window.dispatchEvent(new Event("auth-changed"));

      toast.success("Removed from bookmarks.");
    });
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
              <h2>My Bookmarks ({pagination.totalElements})</h2>
              <nav id="breadcrumbs">
                <ul>
                  <Link to="/">Home</Link>
                  <li>My Bookmarks</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {bookmarks.length === 0 ? (
          <div className="notification notice large">
            <h4>You haven't bookmarked any places yet.</h4>
          </div>
        ) : (
          <div className="row sticky-wrapper">
            <div className="col-lg-12 col-md-12">
              <div className="dashboard-list-box margin-top-0 shadow">
                <h4>Bookmarked Listings</h4>
                <ul>
                  {bookmarks.map((bookmark) => (
                    <ListingItem
                      key={bookmark.id}
                      listing={bookmark}
                      actions={[
                        {
                          icon: "sl-icon-close",
                          label: "Remove",
                          onClick: () => handleRemove(bookmark.id),
                        },
                      ]}
                    />
                  ))}
                </ul>
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
        )}
      </div>
    </div>
  );
};

export default MyBookmarks;
