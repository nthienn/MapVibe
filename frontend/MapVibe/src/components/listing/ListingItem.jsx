import { Link } from "react-router";
import { formatLocationAddress } from "../../utils/locationAddress";
import StarRating from "../common/StarRating";

const ListingItem = ({ listing, actions = [], detailPath, status }) => {
  const formattedAddress = formatLocationAddress(listing);

  const path = detailPath ?? `/listings/${listing.slug}`;

  let ratingClass;

  if (status?.toUpperCase() === "ACTIVE") {
    ratingClass = "high";
  } else if (status?.toUpperCase() === "PENDING") {
    ratingClass = "mid";
  } else if (status?.toUpperCase() === "REJECTED") {
    ratingClass = "low";
  } else {
    ratingClass = "gray";
  }

  return (
    <li>
      <div className="list-box-listing">
        <div className="list-box-listing-img">
          <Link to={path}>
            <img src={listing.images?.[0]} alt={listing.name} />
          </Link>
        </div>

        <div className="list-box-listing-content">
          <div className="inner">
            <h3>
              <Link to={path}>{listing.name}</Link>
            </h3>

            <span>{formattedAddress}</span>

            <div className="star-rating">
              <StarRating
                rating={listing.averageRating}
                reviewCount={listing.totalReviews}
              />
            </div>

            {status && (
              <div
                className={`numerical-rating ${ratingClass}`}
                style={{ width: "100px" }}
              >
                {status}
              </div>
            )}
          </div>
        </div>
      </div>

      {actions.length > 0 && (
        <div className="buttons-to-right">
          <div className="button-group">
            {actions.map((action) => (
              <button
                key={action.label}
                className="button gray"
                onClick={(e) => {
                  e.preventDefault();
                  action.onClick();
                }}
                disabled={action.disabled}
              >
                <i className={`sl ${action.icon}`}></i> {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </li>
  );
};

export default ListingItem;
