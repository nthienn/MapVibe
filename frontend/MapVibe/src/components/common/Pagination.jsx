const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleClick = (e, page) => {
    e.preventDefault();

    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    onPageChange(page);
  };

  const getVisiblePages = (currentPage, totalPages) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 5) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 4) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <nav className="pagination">
      <ul>
        {/* Previous */}
        <li>
          <a
            href="/"
            className={currentPage === 1 ? "disabled" : ""}
            onClick={(e) => handleClick(e, currentPage - 1)}
          >
            <i className="sl sl-icon-arrow-left"></i>
          </a>
        </li>

        {/* Page Numbers */}
        {getVisiblePages(currentPage, totalPages).map((page, index) => {
          if (page === "...") {
            return (
              <li key={`ellipsis-${index}`} className="blank">
                <span>...</span>
              </li>
            );
          }

          return (
            <li key={page}>
              <a
                href="/"
                className={page === currentPage ? "current-page" : ""}
                onClick={(e) => handleClick(e, page)}
              >
                {page}
              </a>
            </li>
          );
        })}

        {/* Next */}
        <li>
          <a
            href="/"
            className={currentPage === totalPages ? "disabled" : ""}
            onClick={(e) => handleClick(e, currentPage + 1)}
          >
            <i className="sl sl-icon-arrow-right"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
