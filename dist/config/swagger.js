import swaggerJsdoc from 'swagger-jsdoc';
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Product & Cart API',
            version: '1.0.0',
            description: 'REST API for products, categories, and cart management with authentication',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        servers: [
            { url: 'http://localhost:5000', description: 'Development server' },
            { url: 'https://klab-nodejs-api.onrender.com', description: 'Production server' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token',
                },
            },
            schemas: {
                // -------------------- Cart --------------------
                CartItem: {
                    type: 'object',
                    properties: {
                        productId: { type: 'number', example: 123 },
                        quantity: { type: 'number', example: 2 },
                    },
                },
                Cart: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64f1b9c9d0e4b1a2c3d4e5f6' },
                        userId: { type: 'string', example: '64f1b9c9d0e4b1a2c3d4e5f0' },
                        items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                // -------------------- Category --------------------
                CategoryInput: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: { type: 'string', example: 'Electronics' },
                        description: { type: 'string', example: 'Electronic devices and accessories' },
                    },
                },
                Category: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64f1b9c9d0e4b1a2c3d4e5f1' },
                        name: { type: 'string', example: 'Electronics' },
                        description: { type: 'string', example: 'Electronic devices and accessories' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // paths to controllers
};
const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
