import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsPage from "./pages/ProductsPage";
import CreateProductPage from "./pages/CreateProductPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
           path="/products"
           element={
           <ProtectedRoute>
           <ProductsPage />
           </ProtectedRoute>
           }
/>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/products/new"
          element={
                  <ProtectedRoute>
                  <CreateProductPage />
                  </ProtectedRoute>
                  }
                />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;