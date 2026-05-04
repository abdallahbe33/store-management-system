import { useEffect, useState } from "react";
import api from "../api/axios";

type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await api.get("/categories");
      setCategories(response.data.categories);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsCreating(true);
      setMessage("");

      await api.post("/categories", {
        name,
      });

      setName("");
      await fetchCategories();
      setMessage("Category created successfully");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");

      await api.delete(`/categories/${id}`);

      await fetchCategories();
      setMessage("Category deleted successfully");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Categories</h1>

      <form onSubmit={handleCreateCategory} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={{ padding: "8px", width: "280px", marginRight: "8px" }}
        />

        <button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Category"}
        </button>
      </form>

      {message && <p>{message}</p>}

      {isLoading ? (
        <p>Loading categories...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Created At</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td style={tdStyle}>{category.name}</td>
                <td style={tdStyle}>
                  {new Date(category.createdAt).toLocaleString()}
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default CategoriesPage;