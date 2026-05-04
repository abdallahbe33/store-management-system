import { useEffect, useState } from "react";
import api from "../api/axios";

type Product = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
};

type StockMovement = {
  id: string;
  type: "IN" | "OUT" | "ADJUSTMENT" | "RETURN";
  quantity: number;
  note?: string | null;
  createdAt: string;
  product: {
    name: string;
    sku: string;
  };
  user: {
    name: string;
    email: string;
    role: string;
  };
};

function StockPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [productId, setProductId] = useState("");
  const [movementType, setMovementType] = useState<"IN" | "OUT" | "ADJUSTMENT">("IN");
  const [quantity, setQuantity] = useState("1");
  const [newQuantity, setNewQuantity] = useState("0");
  const [note, setNote] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMovements = async () => {
    const response = await api.get("/stock/movements");
    setMovements(response.data.movements);
  };

  const fetchProducts = async () => {
    const response = await api.get("/products", {
      params: {
        page: 1,
        limit: 100,
      },
    });

    setProducts(response.data.products);
  };

  const fetchPageData = async () => {
    try {
      setIsLoading(true);
      setMessage("");

      await Promise.all([fetchMovements(), fetchProducts()]);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to load stock page");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setMessage("");

      if (movementType === "ADJUSTMENT") {
        await api.post("/stock/adjust", {
          productId,
          newQuantity: Number(newQuantity),
          note: note || undefined,
        });
      } else {
        const endpoint = movementType === "IN" ? "/stock/in" : "/stock/out";

        await api.post(endpoint, {
          productId,
          quantity: Number(quantity),
          note: note || undefined,
        });
      }

      setProductId("");
      setQuantity("1");
      setNewQuantity("0");
      setNote("");

      await fetchPageData();
      setMessage("Stock updated successfully");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to update stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Stock Movements</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr auto",
          gap: "12px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <select
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
          style={inputStyle}
        >
          <option value="">Select product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} — stock: {product.quantity}
            </option>
          ))}
        </select>

        <select
          value={movementType}
          onChange={(event) =>
            setMovementType(event.target.value as "IN" | "OUT" | "ADJUSTMENT")
          }
          style={inputStyle}
        >
          <option value="IN">Add Stock</option>
          <option value="OUT">Remove Stock</option>
          <option value="ADJUSTMENT">Adjust Stock</option>
        </select>

        {movementType === "ADJUSTMENT" ? (
          <input
            type="number"
            min="0"
            value={newQuantity}
            onChange={(event) => setNewQuantity(event.target.value)}
            placeholder="New quantity"
            style={inputStyle}
          />
        ) : (
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="Quantity"
            style={inputStyle}
          />
        )}

        <input
          type="text"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Note"
          style={inputStyle}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Update Stock"}
        </button>
      </form>

      {message && <p>{message}</p>}

      {isLoading ? (
        <p>Loading stock movements...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>SKU</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Note</th>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Created At</th>
            </tr>
          </thead>

          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td style={tdStyle}>{movement.product.name}</td>
                <td style={tdStyle}>{movement.product.sku}</td>
                <td style={tdStyle}>{movement.type}</td>
                <td style={tdStyle}>{movement.quantity}</td>
                <td style={tdStyle}>{movement.note || "-"}</td>
                <td style={tdStyle}>{movement.user.name}</td>
                <td style={tdStyle}>
                  {new Date(movement.createdAt).toLocaleString()}
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

export default StockPage;