import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import DashboardContent from "./components/DashboardContent";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await adminService.getDashboard();
        setDashboard(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <DashboardContent dashboard={dashboard} loading={loading} />;
};

export default AdminDashboard;
