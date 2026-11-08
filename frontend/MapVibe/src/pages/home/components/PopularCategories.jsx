import { Link } from "react-router";
import { buildSearchParams } from "../../../utils/searchParams";

const PopularCategories = ({ categories = [] }) => {
  return (
    <section
      className="fullwidth margin-top-0 padding-top-0 padding-bottom-40"
      style={{ backgroundColor: "#fcfcfc" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h3 className="headline margin-top-75">
              <strong className="headline-with-separator">
                Popular Categories
              </strong>
              <span>
                Browse <i>the most desirable</i> categories
              </span>
            </h3>
          </div>

          <div className="col-md-12">
            <div className="categories-boxes-container margin-top-5 margin-bottom-30">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/listings?${buildSearchParams({ category })}`}
                  className="category-small-box"
                >
                  <i className={category.icon}></i>

                  <h4>{category.name}</h4>

                  <span className="category-box-counter">
                    {category.locationCount}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
