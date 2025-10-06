// backend_service/src/server.js - Updated with cors package
const path = require("path");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

//use __dirname directly in CommonJS
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

const express = require("express");
const { setupRoutes } = require("./routes/routes");
const helmet = require("helmet");
const morgan = require("morgan");

const server = express();

// CORS configuration
const corsOptions = {
  origin: [
    "https://unicamp-three.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

//apply rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 60,
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again after 1 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

server.use(helmet());
server.use(cors(corsOptions));
server.use(morgan("combined"));
server.use(express.json({ limit: "50mb" }));

server.use("/api", [apiLimiter]);

setupRoutes(server);

module.exports = server;
