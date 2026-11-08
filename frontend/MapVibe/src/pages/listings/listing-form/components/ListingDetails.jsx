import AmenitySelect from "../../../../components/select/AmenitySelect";

const ListingDetails = ({ formData, setFormData, onChange }) => {
  return (
    <div className="add-listing-section margin-top-45">
      <div className="add-listing-headline">
        <h3>
          <i className="sl sl-icon-docs"></i> Details
        </h3>
      </div>

      {/* Description */}
      <div className="form">
        <h5>Description</h5>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          cols="40"
          rows="3"
        />
      </div>

      {/* Contact Information */}
      <div className="row with-forms">
        {/* Phone */}
        <div className="col-md-4">
          <h5>
            <i className="fa fa-phone"></i> Phone <span>(optional)</span>
          </h5>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={onChange}
          />
        </div>

        {/* Website */}
        <div className="col-md-4">
          <h5>
            <i className="fa fa-link"></i> Website <span>(optional)</span>
          </h5>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={onChange}
          />
        </div>

        {/* Email Address */}
        <div className="col-md-4">
          <h5>
            <i className="fa fa-envelope-o"></i> E-mail <span>(optional)</span>
          </h5>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="row with-forms">
        {/* Facebook */}
        <div className="col-md-4">
          <h5 className="fb-input">
            <i className="fa fa-facebook-square"></i> Facebook{" "}
            <span>(optional)</span>
          </h5>
          <input
            type="text"
            name="facebook"
            value={formData.facebook}
            onChange={onChange}
            placeholder="https://www.facebook.com/"
          />
        </div>

        {/* Instagram */}
        <div className="col-md-4">
          <h5>
            <i className="fa fa-instagram"></i> Instagram{" "}
            <span>(optional)</span>
          </h5>
          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={onChange}
            placeholder="https://www.instagram.com/"
          />
        </div>

        {/* Tiktok */}
        <div className="col-md-4">
          <h5>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              width="16"
              height="16"
              fill="currentColor"
              style={{ display: "inline-block", verticalAlign: "middle" }}
            >
              <path d="M544.5 273.9C500.5 274 457.5 260.3 421.7 234.7L421.7 413.4C421.7 446.5 411.6 478.8 392.7 506C373.8 533.2 347.1 554 316.1 565.6C285.1 577.2 251.3 579.1 219.2 570.9C187.1 562.7 158.3 545 136.5 520.1C114.7 495.2 101.2 464.1 97.5 431.2C93.8 398.3 100.4 365.1 116.1 336C131.8 306.9 156.1 283.3 185.7 268.3C215.3 253.3 248.6 247.8 281.4 252.3L281.4 342.2C266.4 337.5 250.3 337.6 235.4 342.6C220.5 347.6 207.5 357.2 198.4 369.9C189.3 382.6 184.4 398 184.5 413.8C184.6 429.6 189.7 444.8 199 457.5C208.3 470.2 221.4 479.6 236.4 484.4C251.4 489.2 267.5 489.2 282.4 484.3C297.3 479.4 310.4 469.9 319.6 457.2C328.8 444.5 333.8 429.1 333.8 413.4L333.8 64L421.8 64C421.7 71.4 422.4 78.9 423.7 86.2C426.8 102.5 433.1 118.1 442.4 131.9C451.7 145.7 463.7 157.5 477.6 166.5C497.5 179.6 520.8 186.6 544.6 186.6L544.6 274z" />
            </svg>{" "}
            Tiktok <span>(optional)</span>
          </h5>
          <input
            type="text"
            name="tiktok"
            value={formData.tiktok}
            onChange={onChange}
            placeholder="https://www.tiktok.com/"
          />
        </div>
      </div>

      {/* Amenities */}
      <h5 className="margin-top-30 margin-bottom-10">
        Amenities <span>(optional)</span>
      </h5>
      <AmenitySelect
        selectedIds={formData.amenityIds}
        onChange={(amenityIds) =>
          setFormData((prev) => ({
            ...prev,
            amenityIds,
          }))
        }
      />
    </div>
  );
};

export default ListingDetails;
