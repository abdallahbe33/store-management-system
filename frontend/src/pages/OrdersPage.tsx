import { useEffect, useState } from "react";
import api from "../api/axios";

type Product = {
  id: string;
  name: string;
  sku: string;
  price: string;
  quantity: number;
};

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: string;
  product: Product;
};

type Order = {
  id: string;
  customerName: string;
  status: "PENDING" | "APPROVED" | "SHIPPED" | "CANCELLED";
  totalPrice: string;
  createdAt: string;
  items: OrderItem[];
};

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchOrders = async () => {
    const response = await api.get("/orders");
    setOrders(response.data.orders);
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

      await Promise.all([fetchOrders(), fetchProducts()]);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to load orders page");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const handleCreateOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsCreating(true);
      setMessage("");

      await api.post("/orders", {
        customerName,
        items: [
          {
            productId,
            quantity: Number(quantity),
          },
        ],
      });

      setCustomerName("");
      setProductId("");
      setQuantity("1");

      await fetchOrders();
      setMessage("Order created successfully");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to create order");
    } finally {
      setIsCreating(false);
    }
  };

  const handleApproveOrder = async (orderId: string) => {
    try {
      setMessage("");

      await api.patch(`/orders/${orderId}/status`, {
        status: "APPROVED",
      });

      await Promise.all([fetchOrders(), fetchProducts()]);
      setMessage("Order approved successfully");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to approve order");
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Orders</h1>

      <form
        onSubmit={handleCreateOrder}
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 1fr auto",
          gap: "12px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Customer name"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          style={inputStyle}
        />

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

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          style={inputStyle}
        />

        <button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Order"}
        </button>
      </form>

      {message && <p>{message}</p>}

      {isLoading ? (
        <p>Loading orders...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Items</th>
              <th style={thStyle}>Created At</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={tdStyle}>{order.customerName}</td>
                <td style={tdStyle}>{order.status}</td>
                <td style={tdStyle}>${Number(order.totalPrice).toFixed(2)}</td>
                <td style={tdStyle}>
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {item.product.name} × {item.quantity}
                    </div>
                  ))}
                </td>
                <td style={tdStyle}>
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td style={tdStyle}>
                  {order.status === "PENDING" ? (
                    <button onClick={() => handleApproveOrder(order.id)}>
                      Approve
                    </button>
                  ) : (
                    "-"
                  )}
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

export default OrdersPage;