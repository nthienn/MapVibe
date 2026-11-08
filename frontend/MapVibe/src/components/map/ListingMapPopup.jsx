import { formatLocationAddress } from "../../utils/locationAddress";
import { isLocationOpenNow } from "../../utils/openingHours";
import StarRating from "../common/StarRating";

const ListingMapPopup = ({ listing }) => {
  const isOpen = isLocationOpenNow(listing.openingHours);
  const formattedAddress = formatLocationAddress(listing);

  return (
    <div className="listing-map-popup">
      {listing.images?.[0] && (
        <div className="listing-map-popup-image-wrapper">
          <img
            className="listing-map-popup-image"
            src={listing.images[0]}
            alt={listing.name || "Listing"}
          />
        </div>
      )}

      <div className="listing-map-popup-content">
        <h4 className="listing-map-popup-title">{listing.name}</h4>

        <div className="listing-map-popup-address">
          <i className="fa fa-map-marker" />
          <span>{formattedAddress}</span>
        </div>

        <div className="listing-map-popup-rating">
          <div className="star-rating">
            <StarRating
              rating={listing.averageRating}
              reviewCount={listing.totalReviews}
            />
          </div>
        </div>

        {isOpen !== null && (
          <div
            className={`listing-map-popup-status ${
              isOpen ? "now-open" : "now-closed"
            }`}
          >
            <span className="listing-map-popup-status-dot" />
            <span>{isOpen ? "Now Open" : "Now Closed"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingMapPopup;
