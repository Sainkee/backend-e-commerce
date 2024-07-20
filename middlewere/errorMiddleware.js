import customError from "../utils/error.js";

const errorHandlingMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof customError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  res.status(500).json({ message: "An unexpected error occurred" });
};

export default errorHandlingMiddleware;
