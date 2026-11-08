import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { buildSearchParams } from "../../../utils/searchParams";
import ReactSlick from "react-slick";
import CategorySelect from "../../../components/select/CategorySelect";
import LocationAutocomplete from "../../../components/listing/LocationAutocomplete";

const Slider = ReactSlick.default || ReactSlick;

const HeroSection = ({ categories = [] }) => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [currentWord, setCurrentWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [isBlinking, setIsBlinking] = useState(false);

  const photoSliderSettings = {
    className: "msps-slider",
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
  };

  const words = useMemo(() => {
    if (categories.length === 0) {
      return ["Attractions"];
    }

    return categories.map((category) => category.name);
  }, [categories]);

  useEffect(() => {
    let timer;
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      if (isDeleting) {
        setCurrentWord(fullText.substring(0, currentWord.length - 1));
        setTypingSpeed(40);
        setIsBlinking(false);
      } else {
        setCurrentWord(fullText.substring(0, currentWord.length + 1));
        setTypingSpeed(80);
        setIsBlinking(false);
      }

      if (!isDeleting && currentWord === fullText) {
        setIsBlinking(true);
        setTypingSpeed(2000);
        setIsDeleting(true);
      } else if (isDeleting && currentWord === "") {
        setIsBlinking(true);
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    };

    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentWord, isDeleting, loopNum, typingSpeed, words]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (e.clientX / innerWidth - 0.5) * 40,
      y: (e.clientY / innerHeight - 0.5) * 40,
    });
  };

  const handleSearchTextChange = (value) => {
    setSearchText(value);
    setSelectedLocation(null);
  };

  const handleLocationSelect = (suggestion) => {
    setSearchText(suggestion.name);
    setSelectedLocation(suggestion);

    const params = buildSearchParams({
      category: selectedCategory,
      location: suggestion.name,
      locationId: suggestion.id,
    });

    navigate(`/listings?${params}`);
  };

  const handleSearch = () => {
    const params = buildSearchParams({
      keyword: selectedLocation ? "" : searchText,
      category: selectedCategory,
      locationId: selectedLocation?.id,
    });

    navigate(`/listings?${params}`);
  };

  return (
    <div
      className="main-search-container plain-color"
      onMouseMove={handleMouseMove}
    >
      <div className="main-search-inner">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="main-search-headlines">
                <h2>
                  Find Nearby
                  <span className="typed-words"> {currentWord}</span>
                  <span
                    className={`typed-cursor ${isBlinking ? "typed-cursor--blink" : ""}`}
                  >
                    |
                  </span>
                </h2>
                <h4>Expolore top-rated attractions, activities and more</h4>
              </div>

              <div className="main-search-input">
                <div
                  className="main-search-input-item location"
                  style={{ flex: 2 }}
                >
                  <LocationAutocomplete
                    value={searchText}
                    onChange={handleSearchTextChange}
                    onSelect={handleLocationSelect}
                    onSearch={handleSearch}
                  />

                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <i className="fa fa-map-marker"></i>
                  </a>
                </div>

                <div className="main-search-input-item">
                  <CategorySelect
                    selectedCategory={selectedCategory}
                    onChange={setSelectedCategory}
                  />
                </div>

                <button className="button" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* <!-- Features Categories --> */}
          <div className="row">
            <div className="col-md-12">
              <h5 className="highlighted-categories-headline">
                Or browse featured categories:
              </h5>
              <div className="highlighted-categories">
                {categories.slice(0, 4).map((category) => (
                  <Link
                    key={category.id}
                    to={`/listings?${buildSearchParams({ category })}`}
                    className="highlighted-category"
                  >
                    <i className={category.icon}></i>
                    <h4>{category.name}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Main Search Photo Slider --> */}
      <div className="container msps-container">
        <div className="main-search-photo-slider">
          <div className="msps-slider-container">
            <Slider {...photoSliderSettings}>
              <div className="item">
                <img src="images/category-box-01.jpg" className="item" />
              </div>
              <div className="item">
                <img src="images/category-box-02.jpg" className="item" />
              </div>
              <div className="item">
                <img src="images/category-box-03.jpg" className="item" />
              </div>
            </Slider>
          </div>
        </div>

        <div className="msps-shapes shapes-animation" id="scene">
          <div
            className="layer"
            style={{
              transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)`,
            }}
          >
            <svg height="40" width="40" className="shape-a">
              <circle
                cx="20"
                cy="20"
                r="17"
                strokeWidth="4"
                fill="transparent"
                stroke="#C400FF"
              />
            </svg>
          </div>

          <div
            className="layer"
            style={{
              transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`,
            }}
          >
            <svg
              width="90"
              height="90"
              viewBox="0 0 500 800"
              className="shape-b"
            >
              <g transform="translate(281,319)">
                <path
                  fill="transparent"
                  style={{ transform: "rotate(25deg)" }}
                  strokeWidth="35"
                  stroke="#F56C83"
                  d="M260.162831,132.205081
				A18,18 0 0,1 262.574374,141.205081
				A18,18 0 0,1 244.574374,159.205081H-244.574374
				A18,18 0 0,1 -262.574374,141.205081
				A18,18 0 0,1 -260.162831,132.205081L-15.588457,-291.410162
				A18,18 0 0,1 0,-300.410162
				A18,18 0 0,1 15.588457,-291.410162Z"
                />
              </g>
            </svg>
          </div>

          <div
            className="layer"
            style={{
              zIndex: -10,
              transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`,
            }}
          >
            <svg
              height="200"
              width="200"
              viewBox="0 0 250 250"
              className="shape-c"
            >
              <path
                d="
				    M 0, 30
				    C 0, 23.400000000000002 23.400000000000002, 0 30, 0
				    S 60, 23.400000000000002 60, 30
				        36.599999999999994, 60 30, 60
				        0, 36.599999999999994 0, 30
				"
                fill="#FADB5F"
                transform="rotate(
				    -25,
				    100,
				    100
				) translate(
				    0
				    0
				) scale(3.5)"
              ></path>
            </svg>
          </div>

          <div
            className="layer"
            style={{
              zIndex: -10,
              transform: `translate(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px)`,
            }}
          >
            <svg height="120" width="120" className="shape-d">
              <circle cx="60" cy="60" r="60" fill="#222" />
            </svg>
          </div>

          <div
            className="layer"
            style={{
              transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
            }}
          >
            <svg
              height="70"
              width="70"
              viewBox="0 0 200 200"
              className="shape-e"
            >
              <path
                fill="#FF0066"
                d="M68.5,-24.5C75.5,-0.8,58.7,28.5,33.5,46.9C8.4,65.4,-25.2,73.1,-42.2,60.2C-59.2,47.4,-59.6,13.9,-49.8,-13.7C-40,-41.3,-20,-63.1,5.4,-64.8C30.7,-66.6,61.5,-48.3,68.5,-24.5Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
