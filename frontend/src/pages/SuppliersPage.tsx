import { useEffect, useState } from "react";
import api from "../api/axios";

type Supplier = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
};

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await api.get("/suppliers");
      setSuppliers(response.data.suppliers);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to load suppliers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCreateSupplier = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsCreating(true);
      setMessage("");

      await api.post("/suppliers", {
        name,
        email: email || undefined,
        phone: phone || undefined,
        address: address || undefined,
      });

      setName("");
      setEmail("");
      setPhone("");
      setAddress("");

      await fetchSuppliers();
      setMessage("Supplier created successfully");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to create supplier");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Suppliers</h1>

      <form
        onSubmit={handleCreateSupplier}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Supplier name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          style={inputStyle}
        />

        <button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Supplier"}
        </button>
      </form>

      {message && <p>{message}</p>}

      {isLoading ? (
        <p>Loading suppliers...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>Created At</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td style={tdStyle}>{supplier.name}</td>
                <td style={tdStyle}>{supplier.email || "-"}</td>
                <td style={tdStyle}>{supplier.phone || "-"}</td>
                <td style={tdStyle}>{supplier.address || "-"}</td>
                <td style={tdStyle}>
                  {new Date(supplier.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "8px",
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

export default SuppliersPage;