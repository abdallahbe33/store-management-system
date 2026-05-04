import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

type DashboardSummary = {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalOrders: number;
  lowStockProducts: number;
  totalRevenue: number;
};

type LowStockProduct = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minStock: number;
};

type RecentOrder = {
  id: string;
  customerName: string;
  status: string;
  totalPrice: string;
  createdAt: string;
};

type RecentStockMovement = {
  id: string;
  type: string;
  quantity: number;
  note?: string | null;
  createdAt: string;
  product: {
    name: string;
    sku: string;
  };
  user: {
    name: string;
  };
};

function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentMovements, setRecentMovements] = useState<RecentStockMovement[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [
          summaryResponse,
          lowStockResponse,
          recentOrdersResponse,
          recentMovementsResponse,
        ] = await Promise.all([
          api.get("/dashboard/summary"),
          api.get("/dashboard/low-stock"),
          api.get("/dashboard/recent-orders"),
          api.get("/dashboard/recent-stock-movements"),
        ]);

        setSummary(summaryResponse.data.summary);
        setLowStockProducts(lowStockResponse.data.products);
        setRecentOrders(recentOrdersResponse.data.orders);
        setRecentMovements(recentMovementsResponse.data.movements);
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.message || "Failed to load dashboard data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div style={pageStyle}>
        <h1>Dashboard</h1>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={pageStyle}>
        <h1>Dashboard</h1>
        <p style={{ color: "red" }}>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h1>Dashboard</h1>
      <p>Welcome to the Store Management System.</p>
      <p>
        <Link to="/products">View Products</Link>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginTop: "24px",
          marginBottom: "32px",
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
          <p>${summary ? summary.totalRevenue.toFixed(2) : "0.00"}</p>
        </div>
      </div>

      <section style={sectionStyle}>
        <h2>Low-Stock Products</h2>

        {lowStockProducts.length === 0 ? (
          <p>No low-stock products.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>SKU</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Minimum Stock</th>
              </tr>
            </thead>

            <tbody>
              {lowStockProducts.map((product) => (
                <tr key={product.id}>
                  <td style={tdStyle}>{product.name}</td>
                  <td style={tdStyle}>{product.sku}</td>
                  <td style={tdStyle}>{product.quantity}</td>
                  <td style={tdStyle}>{product.minStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section style={sectionStyle}>
        <h2>Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <p>No recent orders.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Created At</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td style={tdStyle}>{order.customerName}</td>
                  <td style={tdStyle}>{order.status}</td>
                  <td style={tdStyle}>${Number(order.totalPrice).toFixed(2)}</td>
                  <td style={tdStyle}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section style={sectionStyle}>
        <h2>Recent Stock Movements</h2>

        {recentMovements.length === 0 ? (
          <p>No recent stock movements.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Created At</th>
              </tr>
            </thead>

            <tbody>
              {recentMovements.map((movement) => (
                <tr key={movement.id}>
                  <td style={tdStyle}>
                    {movement.product.name} ({movement.product.sku})
                  </td>
                  <td style={tdStyle}>{movement.type}</td>
                  <td style={tdStyle}>{movement.quantity}</td>
                  <td style={tdStyle}>{movement.user.name}</td>
                  <td style={tdStyle}>
                    {new Date(movement.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "40px auto",
  fontFamily: "Arial",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "16px",
  backgroundColor: "#f9f9f9",
};

const sectionStyle: React.CSSProperties = {
  marginTop: "32px",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
  backgroundColor: "#f2f2f2",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
};

export default DashboardPage;