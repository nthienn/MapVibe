import CategorySelect from "../../../../components/select/CategorySelect";

const ListingBasicInformation = ({
  formData,
  onChange,
  selectedCategory,
  onCategoryChange,
  serverErrors = [],
}) => {
  const getServerError = (field) => {
    return serverErrors.find((error) => error.field === field);
  };
  const nameError = getServerError("name");
  const categoryError = getServerError("categoryId");

  return (
    <div className="add-listing-section">
      <div className="add-listing-headline">
        <h3>
          <i className="sl sl-icon-doc"></i> Basic Informations
        </h3>
      </div>

      <div className="row with-forms">
        {/* Name */}
        <div className="col-md-6">
          <h5>Listing Name</h5>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="e.g. Tom's Restaurant"
            className={nameError ? "input-error" : ""}
          />

          {nameError && (
            <div className="error-wrapper">
              <span className="field-error">{nameError.message}</span>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="col-md-6">
          <h5>Category</h5>
          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={onCategoryChange}
            placeholder="Select Category"
            categoryError={categoryError}
          />

          {categoryError && (
            <div className="error-wrapper">
              <span className="field-error">{categoryError.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingBasicInformation;
