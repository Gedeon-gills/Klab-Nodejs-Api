import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from './config/database.js';
import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js";
import cartRouter from "./routes/cart.js";
import categoryRouter from "./routes/category.js";
import logger from "./middleware/logger.js";
import swaggerSpec from './config/swagger.js';
import swaggerUi from 'swagger-ui-express';
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
// API Routes
const apiV1 = express.Router();
apiV1.use('/auth', authRouter);
apiV1.use('/products', productRouter);
apiV1.use('/carts', cartRouter);
apiV1.use('/categories', categoryRouter);
app.use('/api/v1', apiV1);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running: http://localhost:${PORT}`);
});
export default app;
