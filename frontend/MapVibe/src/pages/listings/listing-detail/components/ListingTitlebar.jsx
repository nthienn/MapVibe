import { formatLocationAddress } from "../../../../utils/locationAddress";
import StarRating from "../../../../components/common/StarRating";

const ListingTitlebar = ({ location }) => {
  const formattedAddress = formatLocationAddress(location);

  return (
    <div id="titlebar" className="listing-titlebar">
      <div className="listing-titlebar-title">
        <h2>
          {location.name}{" "}
          <span className="listing-tag">{location.category.name}</span>
        </h2>
        <span>
          <a href="#listing-location" className="listing-address">
            <i className="fa fa-map-marker"></i> {formattedAddress}
          </a>
        </span>
        <div className="star-rating">
          <a href="#listing-reviews">
            <StarRating
              rating={location.averageRating}
              reviewCount={location.totalReviews}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ListingTitlebar;
