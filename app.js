const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Environment variables load kar
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // React se API calls allow karega
app.use(express.json()); // JSON data parse karega
app.use(express.urlencoded({ extended: true })); // Form data parse karega

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB se connect ho gaya');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Error ho to app band kar do
  }
};
connectDB();

// Routes (baad mein add karenge)
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/auth', require('./routes/auth'));

// React frontend serve karne ke liye (production mein)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Kuchh galat ho gaya!' });
});

// Server start kar
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} pe`);
});