const ListingNav = ({ activeSection, scrollToSection, hasPricing }) => {
  return (
    <ul className="listing-nav">
      <li>
        <a
          href="#listing-overview"
          className={activeSection === "listing-overview" ? "active" : ""}
          onClick={(e) => scrollToSection(e, "listing-overview")}
        >
          Overview
        </a>
      </li>
      {hasPricing && (
        <li>
          <a
            href="#listing-pricing-list"
            className={activeSection === "listing-pricing-list" ? "active" : ""}
            onClick={(e) => scrollToSection(e, "listing-pricing-list")}
          >
            Pricing
          </a>
        </li>
      )}
      <li>
        <a
          href="#listing-location"
          className={activeSection === "listing-location" ? "active" : ""}
          onClick={(e) => scrollToSection(e, "listing-location")}
        >
          Location
        </a>
      </li>
      <li>
        <a
          href="#listing-reviews"
          className={activeSection === "listing-reviews" ? "active" : ""}
          onClick={(e) => scrollToSection(e, "listing-reviews")}
        >
          Reviews
        </a>
      </li>
      <li>
        <a
          href="#add-review"
          className={activeSection === "add-review" ? "active" : ""}
          onClick={(e) => scrollToSection(e, "add-review")}
        >
          Add Review
        </a>
      </li>
    </ul>
  );
};

export default ListingNav;
