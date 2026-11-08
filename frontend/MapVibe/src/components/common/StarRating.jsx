const StarRating = ({ rating, reviewCount }) => {
  const roundedRating = Math.round(rating || 0);

  return (
    <>
      {Array.from({ length: 5 }, (_, index) => (
        <i
          key={index}
          className={`fa fa-star ${index < roundedRating ? "active" : "empty"}`}
        />
      ))}

      {reviewCount !== undefined && (
        <div className="rating-counter">({reviewCount} reviews)</div>
      )}
    </>
  );
};

export default StarRating;
