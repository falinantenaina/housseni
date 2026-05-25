import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import adminRouter from "./router/adminRoutes.js";
import authRouter from "./router/authRoutes.js";
import bannerRouter from "./router/bannerRoutes.js";
import categoryRouter from "./router/categoryRoutes.js";
import notificationRouter from "./router/notificationRoutes.js";
import orderRouter from "./router/orderRoutes.js";
import productRouter from "./router/productRoutes.js";

dotenv.config();

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
app.use("/api/v1/notifications", notificationRouter);

app.get("/api", (req, res) => {
  res.send("API WORKING");
});

connectDB();

app.use(errorMiddleware);

export default app;
