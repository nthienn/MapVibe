import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import NotFound from "./pages/NotFound";
import ListingsPage from "./pages/listings/listing-list/ListingsPage";
import ListingDetailPage from "./pages/listings/listing-detail/ListingDetailPage";
import MyProfile from "./pages/profile/MyProfile";
import MyListings from "./pages/profile/MyListings";
import MyBookmarks from "./pages/profile/MyBookmarks";
import MyReviews from "./pages/profile/MyReviews";
import AddListingPage from "./pages/listings/listing-form/AddListingPage";
import EditListingPage from "./pages/listings/listing-form/EditListingPage";
import UserProfile from "./pages/profile/UserProfile";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminListingsPage from "./pages/admin/listings/AdminListingsPage";
import AdminListingDetailPage from "./pages/admin/listings/AdminListingDetailPage";
import AdminReviewsPage from "./pages/admin/reviews/AdminReviewsPage";
import AdminUsersPage from "./pages/admin/users/AdminUsersPage";
import AdminCategoriesPage from "./pages/admin/categories/AdminCategoriesPage";
import AdminAmenitiesPage from "./pages/admin/amenities/AdminAmenitiesPage";
import AdminRolesPage from "./pages/admin/roles/AdminRolesPage";
import AdminPermissionsPage from "./pages/admin/permissions/AdminPermissionsPage";
import AdminIcon from "./pages/admin/components/AdminIcon";
import Contact from "./pages/Contact";

const AppRoutes = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <AdminLayout>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/listings/pending"
            element={
              <AdminRoute>
                <AdminListingsPage status="PENDING" title="Pending Listings" />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/listings/active"
            element={
              <AdminRoute>
                <AdminListingsPage status="ACTIVE" title="Active Listings" />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/listings/rejected"
            element={
              <AdminRoute>
                <AdminListingsPage
                  status="REJECTED"
                  title="Rejected Listings"
                />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/listings/inactive"
            element={
              <AdminRoute>
                <AdminListingsPage
                  status="INACTIVE"
                  title="Inactive Listings"
                />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/listings/:id"
            element={
              <AdminRoute>
                <AdminListingDetailPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/reviews"
            element={
              <AdminRoute>
                <AdminReviewsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminCategoriesPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/amenities"
            element={
              <AdminRoute>
                <AdminAmenitiesPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/roles"
            element={
              <AdminRoute>
                <AdminRolesPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/permissions"
            element={
              <AdminRoute>
                <AdminPermissionsPage />
              </AdminRoute>
            }
          />
        </Routes>
      </AdminLayout>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/listings" element={<ListingsPage />} />

        <Route path="/listings/:slug" element={<ListingDetailPage />} />

        <Route path="/users/:id/profile" element={<UserProfile />} />

        <Route
          path="/listings/add"
          element={
            <ProtectedRoute>
              <AddListingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listings/:id/edit"
          element={
            <ProtectedRoute>
              <EditListingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookmarks"
          element={
            <ProtectedRoute>
              <MyBookmarks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reviews"
          element={
            <ProtectedRoute>
              <MyReviews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/icons"
          element={
            <AdminRoute>
              <AdminIcon />
            </AdminRoute>
          }
        />

        <Route path="/contact" element={<Contact />} />

        <Route path="*" element={<NotFound />} />
        <Route path="/404" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
