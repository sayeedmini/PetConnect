const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");
const groomerRoutes = require("./routes/groomerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// Initialize Express
const app = express();
const server = http.createServer(app);

// Socket.io for real-time groomer tracking
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/groomers", groomerRoutes);
app.use("/api/bookings", bookingRoutes);

// Socket.io — Live Tracking
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-booking", (bookingId) => {
    socket.join(bookingId);
  });

  socket.on("groomer-location-update", ({ bookingId, coordinates }) => {
    socket.to(bookingId).emit("location-updated", coordinates);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
