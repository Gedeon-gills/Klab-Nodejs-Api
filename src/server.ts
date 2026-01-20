import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from './config/database.js';

import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js";
import cartRouter from "./routes/cart.js";
import categoryRouter from "./routes/category.js";
import orderRouter from "./routes/order.js";
import logger from "./middleware/logger.js";
import UploadRoutes from "./routes/upload.js"
import swaggerSpec from './config/swagger.js';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express();
app.use(express.json());

// ✅ Enable CORS for all routes
app.use(cors());

// logging middleware
app.use(logger);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Product API Docs',
}));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// API Routes
const apiV1 = express.Router();
app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/carts', cartRouter);
app.use('/categories', categoryRouter);
app.use('/orders', orderRouter);
app.use("/uploads",UploadRoutes)

app.use('/api/v1', apiV1);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running: http://localhost:${PORT}`);
});

export default app;