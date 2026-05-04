import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
type Product = {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: string;
  quantity: number;
  minStock: number;
  category?: {
    name: string;
  };
  supplier?: {
    name: string;
  } | null;
};

type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await api.get("/products", {
        params: {
          page: 1,
          limit: 10,
          search: search || undefined,
        },
      });

      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchProducts();
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Products</h1>
      <p><Link to="/products/new">Create New Product</Link></p>

      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name or SKU"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ padding: "8px", width: "280px", marginRight: "8px" }}
        />
        <button type="submit">Search</button>
      </form>

      {isLoading && <p>Loading products...</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {!isLoading && !errorMessage && (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "16px",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>SKU</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Min Stock</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Supplier</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={tdStyle}>{product.name}</td>
                  <td style={tdStyle}>{product.sku}</td>
                  <td style={tdStyle}>${Number(product.price).toFixed(2)}</td>
                  <td style={tdStyle}>{product.quantity}</td>
                  <td style={tdStyle}>{product.minStock}</td>
                  <td style={tdStyle}>{product.category?.name}</td>
                  <td style={tdStyle}>{product.supplier?.name || "-"}</td>
                  <td style={tdStyle}>
                        <Link to={`/products/${product.id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination && (
            <p style={{ marginTop: "16px" }}>
              Page {pagination.page} of {pagination.totalPages} — Total products:{" "}
              {pagination.totalItems}
            </p>
          )}
        </>
      )}
    </div>
  );
}

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

export default ProductsPage;