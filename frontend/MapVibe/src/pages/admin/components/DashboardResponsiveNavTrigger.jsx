const DashboardResponsiveNavTrigger = ({ isOpen, onClick }) => {
  return (
    <a
      href="#"
      className={`dashboard-responsive-nav-trigger ${isOpen ? "active" : ""}`}
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
      }}
    >
      <i className="fa fa-reorder"></i>
      Dashboard Navigation
    </a>
  );
};

export default DashboardResponsiveNavTrigger;
