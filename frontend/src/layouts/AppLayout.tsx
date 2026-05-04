import { Link, Outlet, useNavigate } from "react-router-dom";

function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: "Arial" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div style={{ fontWeight: "bold" }}>Store Management</div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/products/new">Create Product</Link>
          <Link to="/categories">Categories</Link>
            <Link to="/suppliers">Suppliers</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/stock">Stock</Link>
            
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;