const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB();




//app.use(cors());
const allowedOrigins = [
    "http://localhost:5173", // your frontend during development
    "https://your-frontend-domain.vercel.app", // production domain
  ];
  
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true, // required for cookies or Authorization headers
    })
  );

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));



module.exports = app;
