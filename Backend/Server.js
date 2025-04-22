const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// configuring dotenv
require('dotenv').config();

// database connection
connectDB();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/auth", require('./route/auth'));

app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "Prajwal - Design Esthetics." });
})

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})