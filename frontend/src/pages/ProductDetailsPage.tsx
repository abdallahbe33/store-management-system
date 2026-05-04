import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

type Product = {
  id: string;
  name: string;
  sku: string;
  description?: string | null;
  price: string;
  quantity: number;
  minStock: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
  supplier?: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
  } | null;
};

function ProductDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await api.get(`/products/${id}`);

        setProduct(response.data.product);
      } catch (error: any) {
        setErrorMessage(error.response?.data?.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div style={pageStyle}>
        <h1>Product Details</h1>
        <p>Loading product...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={pageStyle}>
        <h1>Product Details</h1>
        <p style={{ color: "red" }}>{errorMessage}</p>
        <Link to="/products">Back to products</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={pageStyle}>
        <h1>Product Details</h1>
        <p>Product not found.</p>
        <Link to="/products">Back to products</Link>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <p>
        <Link to="/products">Back to products</Link>
      </p>

      <h1>{product.name}</h1>

      <div style={cardStyle}>
        <p>
          <strong>SKU:</strong> {product.sku}
        </p>

        <p>
          <strong>Description:</strong> {product.description || "-"}
        </p>

        <p>
          <strong>Price:</strong> ${Number(product.price).toFixed(2)}
        </p>

        <p>
          <strong>Quantity:</strong> {product.quantity}
        </p>

        <p>
          <strong>Minimum Stock:</strong> {product.minStock}
        </p>

        <p>
          <strong>Stock Status:</strong>{" "}
          {product.quantity <= product.minStock ? "Low stock" : "OK"}
        </p>

        <p>
          <strong>Category:</strong> {product.category?.name || "-"}
        </p>

        <p>
          <strong>Supplier:</strong> {product.supplier?.name || "-"}
        </p>

        {product.supplier && (
          <>
            <p>
              <strong>Supplier Email:</strong> {product.supplier.email || "-"}
            </p>

            <p>
              <strong>Supplier Phone:</strong> {product.supplier.phone || "-"}
            </p>
          </>
        )}

        <p>
          <strong>Created At:</strong>{" "}
          {new Date(product.createdAt).toLocaleString()}
        </p>

        <p>
          <strong>Updated At:</strong>{" "}
          {new Date(product.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  maxWidth: "800px",
  margin: "40px auto",
  fontFamily: "Arial",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "20px",
  backgroundColor: "#f9f9f9",
};

export default ProductDetailsPage;