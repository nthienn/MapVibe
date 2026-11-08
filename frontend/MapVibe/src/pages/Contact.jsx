import MapView from "../components/map/MapView";

const Contact = () => {
  return (
    <div className="margin-bottom-55">
      <div className="contact-map margin-bottom-60">
        <div id="singleListingMap-container">
          <MapView latitude="16.077101" longitude="108.222746" />
        </div>

        <div className="address-box-container">
          <div
            className="address-container"
            style={{ backgroundImage: "url(images/our-office.jpg)" }}
          >
            <div className="office-address">
              <h3>Our Office</h3>
              <ul>
                <li>John Street 304</li>
                <li>New York</li>
                <li>Phone (123) 123-456 </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="clearfix"></div>

      <div className="container">
        <div className="row">
          {/* Contact Details */}
          <div className="col-md-4">
            <h4 className="headline margin-bottom-30">Find Us There</h4>
            <div className="sidebar-textbox">
              <p>
                Collaboratively administrate channels whereas virtual.
                Objectively seize scalable metrics whereas proactive e-services.
              </p>

              <ul className="contact-details">
                <li>
                  <i className="im im-icon-Phone-2"></i> <strong>Phone:</strong>{" "}
                  <span>(123) 123-456 </span>
                </li>
                <li>
                  <i className="im im-icon-Fax"></i> <strong>Fax:</strong>{" "}
                  <span>(123) 123-456 </span>
                </li>
                <li>
                  <i className="im im-icon-Globe"></i> <strong>Web:</strong>{" "}
                  <span>
                    <a href="#">www.example.com</a>
                  </span>
                </li>
                <li>
                  <i className="im im-icon-Envelope"></i>{" "}
                  <strong>E-Mail:</strong>{" "}
                  <span>
                    <a href="#">office@example.com</a>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/*  Contact Form  */}
          <div className="col-md-8">
            <section id="contact">
              <h4 className="headline margin-bottom-35">Contact Form</h4>

              <div id="contact-message"></div>

              <form method="post" name="contactform" id="contactform">
                <div className="row">
                  <div className="col-md-6">
                    <div>
                      <input
                        name="name"
                        type="text"
                        id="name"
                        placeholder="Your Name"
                        required="required"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div>
                      <input
                        name="email"
                        type="email"
                        id="email"
                        placeholder="Email Address"
                        pattern="^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$"
                        required="required"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <input
                    name="subject"
                    type="text"
                    id="subject"
                    placeholder="Subject"
                    required="required"
                  />
                </div>

                <div>
                  <textarea
                    name="comments"
                    cols="40"
                    rows="3"
                    id="comments"
                    placeholder="Message"
                    required="required"
                  ></textarea>
                </div>

                <input
                  type="submit"
                  className="submit button"
                  id="submit"
                  value="Submit Message"
                />
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
