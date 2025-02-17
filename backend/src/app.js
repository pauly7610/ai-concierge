const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const userRoutes = require('./api/routes/userRoutes');
const propertyRoutes = require('./api/routes/propertyRoutes');
const recommendationRoutes = require('./api/routes/recommendationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;