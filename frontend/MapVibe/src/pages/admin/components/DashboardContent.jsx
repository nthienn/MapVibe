import { Link } from "react-router";

const DashboardContent = ({ dashboard, loading }) => {
  const stats = [
    {
      value: dashboard?.totalListings ?? 0,
      label: "Total Listings",
      icon: "im im-icon-Map2",
      colorClass: "color-1",
    },
    {
      value: dashboard?.totalUsers ?? 0,
      label: "Total Users",
      icon: "im im-icon-User",
      colorClass: "color-2",
    },
    {
      value: dashboard?.totalReviews ?? 0,
      label: "Total Reviews",
      icon: "im im-icon-Add-UserStar",
      colorClass: "color-3",
    },
    {
      value: dashboard?.totalBookmarks ?? 0,
      label: "Total Bookmarks",
      icon: "im im-icon-Heart",
      colorClass: "color-4",
    },
    {
      value: dashboard?.totalCategories ?? 0,
      label: "Total Categories",
      icon: "im im-icon-Tag-3",
      colorClass: "color-5",
    },
    {
      value: dashboard?.totalAmenities ?? 0,
      label: "Total Amenities",
      icon: "im im-icon-Bulleted-List",
      colorClass: "color-6",
    },
    {
      value: dashboard?.totalRoles ?? 0,
      label: "Total Roles",
      icon: "im im-icon-Checked-User",
      colorClass: "color-7",
    },
    {
      value: dashboard?.totalPermissions ?? 0,
      label: "Total Permissions",
      icon: "im im-icon-Lock",
      colorClass: "color-8",
    },
  ];

  return (
    <>
      {/* Titlebar */}
      <div id="titlebar">
        <div className="row">
          <div className="col-md-12">
            <h2>Dashboard</h2>
            <nav id="breadcrumbs">
              <ul>
                <li>
                  <Link to="/admin">Dashboard</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row">
        {stats.map((stat) => (
          <div className="col-lg-3 col-md-6" key={stat.label}>
            <div className={`dashboard-stat ${stat.colorClass}`}>
              <div className="dashboard-stat-content">
                <h4>{loading ? "..." : stat.value}</h4>

                <span>{stat.label}</span>
              </div>

              <div className="dashboard-stat-icon">
                <i className={stat.icon}></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardContent;
