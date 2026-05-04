import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
type DashboardSummary = {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalOrders: number;
  lowStockProducts: number;
  totalRevenue: number;
};

function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await api.get("/dashboard/summary");

        setSummary(response.data.summary);
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.message || "Failed to load dashboard summary"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}>
        <h1>Dashboard</h1>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}>
        <h1>Dashboard</h1>
        <p style={{ color: "red" }}>{errorMessage}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Dashboard</h1>
      <p>Welcome to the Store Management System.</p>
      <p><Link to="/products">View Products</Link></p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginTop: "24px",
          marginBottom: "24px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Products</h3>
          <p>{summary?.totalProducts}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Categories</h3>
          <p>{summary?.totalCategories}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Suppliers</h3>
          <p>{summary?.totalSuppliers}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Orders</h3>
          <p>{summary?.totalOrders}</p>
        </div>

        <div style={cardStyle}>
          <h3>Low Stock Products</h3>
          <p>{summary?.lowStockProducts}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Revenue</h3>
          <p>${summary?.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "16px",
  backgroundColor: "#f9f9f9",
};

export default DashboardPage;