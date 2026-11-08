const HowItWorksSection = () => {
  return (
    <div className="container margin-top-80 margin-bottom-80">
      <div className="row">
        <div className="col-md-12">
          <h3 className="headline margin-top-0 margin-bottom-40">
            <strong className="headline-with-separator">How It Works?</strong>
          </h3>
        </div>

        <div className="col-md-5">
          <a
            href="#"
            className="icon-box-v3"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div className="ibv3-icon">
              <i className="im im-icon-Add-User"></i>
            </div>
            <div className="ibv3-content">
              <h4>Creata an Account</h4>
              <p>
                Integer dapibus purus sit amet metus scelerisque hendrerit non a
                urna
              </p>
            </div>
          </a>

          <a
            href="#"
            className="icon-box-v3"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div className="ibv3-icon">
              <i className="im im-icon-Add-File"></i>
            </div>
            <div className="ibv3-content">
              <h4>Add Listings</h4>
              <p>
                Phasellus id nulla id tortor laoreet tempor et non risus
                className aptent taciti
              </p>
            </div>
          </a>

          <a
            href="#"
            className="icon-box-v3"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div className="ibv3-icon">
              <i className="im im-icon-Queen"></i>
            </div>
            <div className="ibv3-content">
              <h4>Get Exposure</h4>
              <p>
                Vestibulum pretium massa in bibendum nam mollis quam et feugiat
                consectetur
              </p>
            </div>
          </a>
        </div>

        <div className="col-md-7">
          <div className="svg-alignment">
            <img
              src="images/image_placeholder.svg"
              style={{ width: "60%" }}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
