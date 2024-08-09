import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import httpErrors from "http-errors";
import createHttpError from "http-errors";

//dotenv config
dotenv.config();

//create express app
const app = express();

//morgan
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//helmet
app.use(helmet());

//parse json request url
app.use(express.json());

//parse json request body
app.use(express.urlencoded({ extended: true }));

//sanitize request data
app.use(mongoSanitize());

//enable cookie parser
app.use(cookieParser());

//gzip compression
app.use(compression());

//file upload (access files from req.files)
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//cors
app.use(
  cors({
    origin: "http://localhost:8500",
  })
);

app.post("/test", (req, res) => {
  throw createHttpError.BadRequest("this route has an error");
});

//route not found
app.use(async (req, res, next) => {
  //Creates a 404 Not Found error and passes it to the error handling middleware
  next(createHttpError.NotFound("This route does not exist."));
});

//catches all errors passed through the `next()` function
app.use(async (err, req, res, next) => {
  // Sets the HTTP status code based on the error's status or defaults to 500 (Internal Server Error)
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

export default app;
