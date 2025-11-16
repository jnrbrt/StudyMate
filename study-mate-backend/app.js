const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

require('dotenv').config();
connectDB();

const app = express();

// Middleware

// Body parser: a route-ok tudják olvasni a req.body-t
app.use(express.json());

// Cookie parser: ha később cookie-t is szeretnél használni
app.use(cookieParser());

// CORS: csak a frontend URL-jét engedélyezzük, később éles környezetben könnyen módosítható
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/ai', require('./routes/ai'));

module.exports = app;
