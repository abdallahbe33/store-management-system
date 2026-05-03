import express from "express";

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Store Management API is running",
  });
});
app.get("/api/test", (req, res) => {
  res.status(200).json({
    message: "Test route works",
  });
});

export default app;