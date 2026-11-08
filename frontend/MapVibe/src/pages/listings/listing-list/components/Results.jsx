import ListingCard from "../../../../components/listing/ListingCard";
import Pagination from "../../../../components/common/Pagination";

const Results = ({
  listings,
  setListings,
  pagination,
  onPageChange,
  onListingHover,
  hoveredListingId,
}) => {
  const handleBookmarkToggle = (listingId) => (result) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === listingId
          ? {
              ...item,
              bookmarked: result.bookmarked,
              bookmarkCount: result.bookmarkCount,
            }
          : item,
      ),
    );
  };

  return (
    <section className="listings-container margin-top-30">
      <div className="row fs-switcher">
        <div className="col-md-6">
          <p className="showing-results">{listings.length} Results Found</p>
        </div>
      </div>

      {/* Listings */}
      <div className="row fs-listings">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onBookmarkToggle={handleBookmarkToggle(listing.id)}
            onHover={onListingHover}
            isHighlighted={hoveredListingId === listing.id}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="row fs-listings">
        <div className="col-md-12">
          <div className="clearfix"></div>
          {pagination.totalElements > 0 && (
            <div className="pagination-container margin-top-15 margin-bottom-40">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}

          <div className="clearfix"></div>
          <div className="copyrights margin-top-0">
            © {new Date().getFullYear()} Listeo. All Rights Reserved.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;
