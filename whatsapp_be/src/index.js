import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app.js";
import logger from "./configs/logger.config.js";
import SocketServer from "./SocketServer.js";

//env variables
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;

//exit on mongodb error
mongoose.connection.on("error", (err) => {
  logger.error(`Mongodb connection error :${err}`);
  process.exit(1); //exit stop server if there is some error encountered
});

//mongodb debug mode
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

//mongodb connection
mongoose.connect(DATABASE_URL).then(() => {
  logger.info("Connected to Mongodb.");
});

let server = app.listen(PORT, () => {
  logger.info(`server running at port ${PORT}...`);
});

//socket io
const io = new Server(server, {
  pingTimeout: 60000, //a minute
  cors: {
    origin: process.env.CLIENT_ENDPOINT,
  },
});

//for sending we use 'emit' and for receiving we use 'on'
io.on("connection",(socket)=>{
  logger.info('socket io connected successfully.')
  SocketServer(socket);
})//after connection with backend

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
