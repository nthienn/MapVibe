import { useRef } from "react";
import { Link } from "react-router";
import { isLocationOpenNow } from "../../../utils/openingHours";
import { formatLocationAddress } from "../../../utils/locationAddress";
import ReactSlick from "react-slick";
import useBookmark from "../../../hooks/useBookmark";
import StarRating from "../../../components/common/StarRating";

const Slider = ReactSlick.default || ReactSlick;

const FeaturedListings = ({ listings = [], setListings }) => {
  const { toggleBookmark } = useBookmark();

  const handleBookmarkToggle = async (e, locationId) => {
    e.preventDefault();
    e.stopPropagation();

    await toggleBookmark(locationId, (result) => {
      setListings((prev) =>
        prev.map((item) =>
          item.id === locationId
            ? {
                ...item,
                bookmarked: result.bookmarked,
                bookmarkCount: result.bookmarkCount,
              }
            : item,
        ),
      );
    });
  };

  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleLinkClick = (e) => {
    const deltaX = Math.abs(e.clientX - dragStart.current.x);
    const deltaY = Math.abs(e.clientY - dragStart.current.y);
    if (deltaX > 5 || deltaY > 5) {
      e.preventDefault();
    }
  };

  var settings = {
    className: "simple-slick-carousel dots-nav",
    dots: true,
    infinite: listings.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container margin-top-70">
      <div className="row">
        <div className="col-md-12">
          <h3 className="headline centered margin-bottom-45">
            <strong className="headline-with-separator">
              Most Visited Places
            </strong>
            <span>Discover top-rated places submitted by community</span>
          </h3>
        </div>

        <div className="col-md-12">
          <Slider {...settings}>
            {/* Listing Item */}
            {listings.map((item) => {
              const isOpen = isLocationOpenNow(item.openingHours);
              const formattedAddress = formatLocationAddress(item);

              return (
                <div key={item.id} className="carousel-item">
                  <Link
                    to={`/listings/${item.slug}`}
                    className="listing-item-container"
                    draggable={false}
                    onMouseDown={handleMouseDown}
                    onClick={handleLinkClick}
                  >
                    <div className="listing-item">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        draggable={false}
                      />

                      {isOpen !== null && (
                        <div
                          className={`listing-badge ${isOpen ? "now-open" : "now-closed"}`}
                        >
                          {isOpen ? "Now Open" : "Now Closed"}
                        </div>
                      )}

                      <div className="listing-item-content">
                        <span className="tag">{item.category.name}</span>

                        <h3>{item.name}</h3>

                        <span>{formattedAddress}</span>

                        <span
                          className={`like-icon ${item.bookmarked ? "liked" : ""}`}
                          onClick={(e) => handleBookmarkToggle(e, item.id)}
                        ></span>
                      </div>
                    </div>

                    <div className="star-rating">
                      <StarRating
                        rating={item.averageRating}
                        reviewCount={item.totalReviews}
                      />
                    </div>
                  </Link>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default FeaturedListings;
