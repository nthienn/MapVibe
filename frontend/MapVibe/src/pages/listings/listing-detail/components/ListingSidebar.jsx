import { Link } from "react-router";
import {
  DAYS_OF_WEEK,
  formatOpeningHours,
  isLocationOpenNow,
} from "../../../../utils/openingHours";

const ListingSidebar = ({ location, onBookmarkToggle }) => {
  const isOpen = isLocationOpenNow(location.openingHours);

  return (
    <div className="col-lg-4 col-md-4 margin-top-75 sticky">
      {/*  Verified Badge */}
      {location.isVerified && (
        <div
          className="verified-badge with-tip"
          data-tip-content="Listing has been verified and belongs the business owner or manager."
        >
          <i className="sl sl-icon-check"></i> Verified Listing
        </div>
      )}

      {/* Opening Hours */}
      {location.openingHours.length > 0 && (
        <div className="boxed-widget opening-hours margin-top-35">
          {isOpen !== null && (
            <div
              className={`listing-badge ${isOpen ? "now-open" : "now-closed"}`}
            >
              {isOpen ? "Now Open" : "Now Closed"}
            </div>
          )}
          <h3>
            <i className="sl sl-icon-clock"></i> Opening Hours
          </h3>
          <ul>
            {DAYS_OF_WEEK.map((day) => {
              const openingHour = location.openingHours?.find(
                (item) => item.dayOfWeek === day.dayOfWeek,
              );

              return (
                <li key={day.dayOfWeek}>
                  {day.name}
                  <span>{formatOpeningHours(openingHour)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Host */}
      <div className="boxed-widget margin-top-35">
        <div className="hosted-by-title">
          <h4>
            <span>Shared by</span>{" "}
            <Link to={`/users/${location.user.id}/profile`}>
              {location.user.name}
            </Link>
          </h4>
          <Link
            to={`/users/${location.user.id}/profile`}
            className="hosted-by-avatar"
          >
            <img src={location.user.avatar} alt={location.user.name} />
          </Link>
        </div>
        {/* <ul className="listing-details-sidebar">
          <li>
            <i className="sl sl-icon-phone"></i> {listing.host.phone}
          </li>
          <li>
            <i className="fa fa-envelope-o"></i>{" "}
            <a href={`mailto:${listing.host.email}`}>{listing.host.email}</a>
          </li>
        </ul> */}
      </div>

      {/* <!-- Share / Like --> */}
      <div className="listing-share margin-top-40 margin-bottom-40 no-border">
        <button className="like-button" onClick={onBookmarkToggle}>
          <span
            className={`like-icon ${location.bookmarked ? "liked" : ""}`}
          ></span>{" "}
          Bookmark this listing
        </button>
        {location.bookmarkCount > 0 ? (
          <span>{location.bookmarkCount} people bookmarked this place</span>
        ) : (
          <span>Save this location to your favorites list.</span>
        )}

        {/* <!-- Share Buttons --> */}
        <ul className="share-buttons margin-top-40 margin-bottom-0">
          <li>
            <a className="fb-share" href="#">
              <i className="fa fa-facebook"></i> Share
            </a>
          </li>
          <li>
            <a className="twitter-share" href="#">
              <i className="fa fa-twitter"></i> Tweet
            </a>
          </li>
          <li>
            <a className="gplus-share" href="#">
              <i className="fa fa-google-plus"></i> Share
            </a>
          </li>
        </ul>
        <div className="clearfix"></div>
      </div>
    </div>
  );
};

export default ListingSidebar;
