import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import customerRoutes from '../routes/customers.routes';
import leadRoutes from '../routes/leads.routes';
import leadStatusRoutes from '../routes/lead-status.routes';
import supplierRoutes from '../routes/suppliers.routes';
import supplierTypeRoutes from '../routes/supplier-type.routes';
import milestoneStatusRoutes from '../routes/milestone-status.routes';
import stageTemplateRoutes from '../routes/stage-template.routes';
import projectRoutes from '../routes/projects.routes';
import projectStatusRoutes from '../routes/project-status.routes';
import authRoutes from '../routes/auth.routes';
import backupRoutes from '../routes/backup.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';
import supplierTypeService from '../services/supplierTypeService';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/videoprojectmanager';


// Middleware
app.use(bodyParser.json());

//app.options('*', cors());

const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://video-project-manager.vercel.app'] 
    : ['http://localhost:4200', 'http://localhost:3000', 'https://video-project-manager-ppr.vercel.app'];

const allowedSet = new Set(allowedOrigins);


app.use((req, res, next) => {
    const origin = req.headers.origin;
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    origin: origin,
    allowedOrigins: allowedOrigins
  });
  console.log('Allowed origins set:', allowedSet);
  if (req.method === 'OPTIONS') {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.status(200).json({});
    } else {
      console.log('OPTIONS blocked origin:', origin);
      return res.status(403).json({ error: 'Not allowed by CORS' });
    }
  }
  next();
});

app.use(cors({ 
    origin: function (origin, callback) {
        console.log('Allowed origins set3:', allowedSet);
        console.log('CORS middleware - origin:', origin);
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/lead-statuses', leadStatusRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/supplier-types', supplierTypeRoutes);
app.use('/api/milestone-statuses', milestoneStatusRoutes);
app.use('/api/stage-templates', stageTemplateRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-statuses', projectStatusRoutes);
app.use('/api/backups', backupRoutes);


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

// Connect to MongoDB
mongoose.connect(DATABASE_URL, {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000,
})
    .then(async () => {
        console.log('Connected to MongoDB');
        // Initialize default supplier types
        await supplierTypeService.initializeDefaults();
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel serverless
export default app;
