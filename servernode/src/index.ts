import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import customerRoutes from '../routes/customers.routes';
import leadRoutes from '../routes/leads.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';

const app = express();
const PORT = 10000;//process.env.PORT || 10000;
const DATABASE_URL ='mongodb+srv://eliahumalkin_db_user:9dSA3N686kLkKUh4@cluster0.jfqizjk.mongodb.net/?appName=Cluster0';// process.env.DATABASE_URL || 'mongodb://localhost:27017/videoprojectmanager';


// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/leads', leadRoutes);


// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Video Project Manager API',
            version: '1.0.0',
            description: 'API documentation for Video Project Manager',
        },
    },
    apis: ['./src/*.routes.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to MongoDB and start server
mongoose.connect(DATABASE_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });