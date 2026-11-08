import { Link } from "react-router";
import { isLocationOpenNow } from "../../utils/openingHours";
import { formatLocationAddress } from "../../utils/locationAddress";
import useBookmark from "../../hooks/useBookmark";
import StarRating from "../common/StarRating";

const ListingCard = ({ listing, onBookmarkToggle, onHover, isHighlighted }) => {
  const isOpen = isLocationOpenNow(listing.openingHours);
  const formattedAddress = formatLocationAddress(listing);

  const { toggleBookmark } = useBookmark();

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    await toggleBookmark(listing.id, onBookmarkToggle);
  };

  return (
    <div className="col-lg-12 col-md-12">
      <div
        className={`listing-item-container list-layout ${isHighlighted ? "is-map-active" : ""}`}
        data-marker-id={listing.id}
        onMouseEnter={() => onHover?.(listing.id)}
      >
        <Link to={`/listings/${listing.slug}`} className="listing-item">
          {/* <!-- Image --> */}
          <div className="listing-item-image">
            <img src={listing.images?.[0]} alt={listing.name} />
            <span className="tag">{listing.category.name}</span>
          </div>

          {/* <!-- Content --> */}
          <div className="listing-item-content">
            {isOpen !== null && (
              <div
                className={`listing-badge ${isOpen ? "now-open" : "now-closed"}`}
              >
                {isOpen ? "Now Open" : "Now Closed"}
              </div>
            )}

            <div className="listing-item-inner">
              <h3>
                {listing.name}{" "}
                {listing.verified && <i className="verified-icon"></i>}
              </h3>

              <span>{formattedAddress}</span>

              <div className="star-rating">
                <StarRating
                  rating={listing.averageRating}
                  reviewCount={listing.totalReviews}
                />
              </div>
            </div>

            <span
              className={`like-icon ${listing.bookmarked ? "liked" : ""}`}
              onClick={(e) => handleBookmarkClick(e, listing.id)}
            ></span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ListingCard;
