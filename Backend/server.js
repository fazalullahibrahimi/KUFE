const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Connect to the database
connectDB();

const PORT = process.env.PORT || 4400;


// Start the server

const server = app.listen(PORT, () => {
  console.log("I am live again on port", PORT);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
