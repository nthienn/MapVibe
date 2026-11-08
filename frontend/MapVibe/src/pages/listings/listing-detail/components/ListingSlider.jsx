import { useState } from "react";
import ReactSlick from "react-slick";
import GalleryModal from "../../../../components/modal/GalleryModal";

const Slider = ReactSlick.default || ReactSlick;

const SlickPrevArrow = ({ onClick }) => (
  <button type="button" className="slick-prev slick-arrow" onClick={onClick}>
    Previous
  </button>
);

const SlickNextArrow = ({ onClick }) => (
  <button type="button" className="slick-next slick-arrow" onClick={onClick}>
    Next
  </button>
);

const ListingSlider = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const openGallery = (index) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const settings = {
    className: "listing-slider mfp-gallery-container",
    centerMode: true,
    centerPadding: images.length > 2 ? "180px" : "0px",
    slidesToShow: images.length > 1 ? 2 : 1,
    infinite: images.length > 1,
    speed: 500,
    prevArrow: <SlickPrevArrow />,
    nextArrow: <SlickNextArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <Slider {...settings}>
        {images.map((imgUrl, index) => (
          <div key={index}>
            <a
              href={`#image-${index}`}
              className="item mfp-gallery"
              draggable={false}
              style={{
                backgroundImage: `url(${imgUrl})`,
                display: "block",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
              onClick={(e) => {
                e.preventDefault();
                openGallery(index);
              }}
            ></a>
          </div>
        ))}
      </Slider>

      <GalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        currentIndex={modalIndex}
        setCurrentIndex={setModalIndex}
      />
    </>
  );
};

export default ListingSlider;
