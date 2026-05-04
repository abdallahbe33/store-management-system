import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CreateProductPage from "./pages/CreateProductPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import CategoriesPage from "./pages/CategoriesPage";
import SuppliersPage from "./pages/SuppliersPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<CreateProductPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;