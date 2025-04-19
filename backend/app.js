const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB();

// ——— CORS CONFIGURATION ———
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend-domain.vercel.app' // ← replace with your actual frontend URL
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

// (optionally handle preflight for all routes)
app.options('*', cors());

// ——— JSON PARSING ———
app.use(express.json());

// ——— HEALTH CHECK ———
app.get("/", (req, res) => {
  res.send("Hello from Express");
});

// ——— YOUR ROUTES ———
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));

module.exports = app;
