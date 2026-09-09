import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import AdminLayout from "./AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import FestivalsPage from "./pages/FestivalsPage";
import BannersPage from "./pages/BannersPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import PrintJobsPage from "./pages/PrintJobsPage";
import CouponsPage from "./pages/CouponsPage";
import InventoryPage from "./pages/InventoryPage";

function Protected({ children }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <Protected>
              <AdminLayout />
            </Protected>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="festivals" element={<FestivalsPage />} />
          <Route path="banners" element={<BannersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="print-jobs" element={<PrintJobsPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
