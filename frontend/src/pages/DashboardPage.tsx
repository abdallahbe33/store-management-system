function DashboardPage() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Dashboard</h1>
      <p>Welcome to the Store Management System.</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default DashboardPage;
