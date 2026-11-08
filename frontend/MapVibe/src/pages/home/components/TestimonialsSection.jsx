import ReactSlick from "react-slick";

const testimonials = [
  {
    id: 1,
    content:
      "Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation is on the runway heading towards a streamlined cloud solution user generated content.",
    name: "Jennie Smith",
    position: "Coffee Shop Owner",
    avatar: "images/happy-client-01.jpg",
  },
  {
    id: 2,
    content:
      "Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop.",
    name: "Tom Baker",
    position: "Clothing Store Owner",
    avatar: "images/happy-client-02.jpg",
  },
  {
    id: 3,
    content:
      "Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view.",
    name: "Jack Paden",
    position: "Restaurant Owner",
    avatar: "images/happy-client-03.jpg",
  },
];

const Slider = ReactSlick.default || ReactSlick;

const TestimonialsSection = () => {
  const settings = {
    className: "testimonial-carousel testimonials slick-dotted",
    dots: true,
    infinite: testimonials.length > 1,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: true,
    centerPadding: "34%",
    arrows: false,
    cssEase: "ease",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          centerPadding: "25%",
        },
      },
      {
        breakpoint: 992,
        settings: {
          centerPadding: "15%",
        },
      },
      {
        breakpoint: 768,
        settings: {
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <section
      className="fullwidth margin-top-70 padding-top-75 padding-bottom-70"
      style={{ backgroundColor: "#f9f9f9" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <h3 className="headline centered">
              What Our Users Say
              <span className="margin-top-25">
                We collect reviews from our users so you can get an honest
                opinion of what an experience with our website are really like!
              </span>
            </h3>
          </div>
        </div>
      </div>

      <div className="fullwidth-carousel-container margin-top-20">
        <Slider {...settings}>
          {testimonials.map((item) => (
            <div key={item.id} className="fw-carousel-review">
              <div className="testimonial-box">
                <div className="testimonial">{item.content}</div>
              </div>

              <div className="testimonial-author">
                <img src={item.avatar} alt={item.name} />

                <h4>
                  {item.name}
                  <span>{item.position}</span>
                </h4>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialsSection;
