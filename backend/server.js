const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const groomerRoutes = require("./routes/groomerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this in production
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());
// Increase limit for base64 if needed, but we are using multer
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/groomers", groomerRoutes);
app.use("/api/bookings", bookingRoutes);

// Socket.io for Real-time Groomer Tracking
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Join a specific booking room
  socket.on("join-booking", (bookingId) => {
    socket.join(bookingId);
    console.log(`Socket ${socket.id} joined room ${bookingId}`);
  });

  // Receive location update from Groomer and broadcast to room
  socket.on("groomer-location-update", (data) => {
    const { bookingId, coordinates } = data;
    // Broadcast to everyone in the room except the sender
    socket.to(bookingId).emit("location-updated", coordinates);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
