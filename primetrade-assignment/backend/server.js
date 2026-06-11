const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');

// 1. Load environment variables & connect to DB first
dotenv.config();
connectDB();

// 2. Initialize the Express application
const app = express();

// 3. Configure Middlewares
app.use(cors({
    origin: true, 
    credentials: true 
}));

app.use(express.json());
app.use(morgan('dev'));

// Limit each IP to 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { message: "Too many requests from this IP, please try again in 15 minutes." }
});

// Apply the rate limiter to all API routes
app.use('/api', apiLimiter);

// 4. API Routes
app.use('/api/v1/auth', require('./src/routes/authRoutes'));
app.use('/api/v1/tasks', require('./src/routes/taskRoutes'));

// 5. Error handling middleware (Must be placed after routes)
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// 6. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));