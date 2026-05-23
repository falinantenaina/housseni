import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import adminRouter from "./router/adminRoutes.js";
import authRouter from "./router/authRoutes.js";
import bannerRouter from "./router/bannerRoutes.js";
import categoryRouter from "./router/categoryRoutes.js";
import orderRouter from "./router/orderRoutes.js";
import productRouter from "./router/productRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.DASHBOARD_URL,
      "http://localhost:5173",
      "https://ets-housseni.com",
      "https://www.ets-housseni.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: false,
  }),
);

// Routes API
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/banners", bannerRouter);

app.get("/api", (req, res) => {
  res.send("API WORKING");
});

connectDB();

// Servir le frontend en production
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./frontend/dist")));

  app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/dist", "index.html"));
  });
}

app.use(errorMiddleware);

export default app;
