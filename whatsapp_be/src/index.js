import app from "./app.js";
import logger from "./configs/logger.config.js";

const PORT = process.env.PORT || 8000;

let server = app.listen(PORT, () => {
  logger.info(`server running at port ${PORT}...`);
});

// Function to handle graceful server shutdown
const exitHandler = () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

// Function to handle unexpected errors (e.g., uncaught exceptions)
const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

// Handle uncaught exceptions and unhandled promise rejections
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

// Handle SIGTERM signal for graceful shutdown (e.g., when stopping the process)
process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});
