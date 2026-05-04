import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

type Category = {
  id: string;
  name: string;
};

type Supplier = {
  id: string;
  name: string;
};

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [quantity, setQuantity] = useState("0");
  const [minStock, setMinStock] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setMessage("");

        const [productResponse, categoriesResponse, suppliersResponse] =
          await Promise.all([
            api.get(`/products/${id}`),
            api.get("/categories"),
            api.get("/suppliers"),
          ]);

        const product = productResponse.data.product;

        setName(product.name);
        setSku(product.sku);
        setDescription(product.description || "");
        setPrice(String(product.price));
        setQuantity(String(product.quantity));
        setMinStock(String(product.minStock));
        setCategoryId(product.categoryId);
        setSupplierId(product.supplierId || "");

        setCategories(categoriesResponse.data.categories);
        setSuppliers(suppliersResponse.data.suppliers);
      } catch (error: any) {
        setMessage(error.response?.data?.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setMessage("");

      await api.patch(`/products/${id}`, {
        name,
        sku,
        description: description || undefined,
        price: Number(price),
        quantity: Number(quantity),
        minStock: Number(minStock),
        categoryId,
        supplierId: supplierId || undefined,
      });

      navigate(`/products/${id}`);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={pageStyle}>
        <h1>Edit Product</h1>
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <p>
        <Link to={`/products/${id}`}>Back to product details</Link>
      </p>

      <h1>Edit Product</h1>

      {message && <p style={{ color: "red" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>SKU</label>
          <input value={sku} onChange={(e) => setSku(e.target.value)} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Minimum Stock</label>
          <input
            type="number"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Supplier</label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            style={inputStyle}
          >
            <option value="">No supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  maxWidth: "700px",
  margin: "40px auto",
  fontFamily: "Arial",
};

const fieldStyle: React.CSSProperties = {
  marginBottom: "14px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  marginTop: "4px",
};

export default EditProductPage;