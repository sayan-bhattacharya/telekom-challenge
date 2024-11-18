// middlewares/errorHandler.js

const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    console.error("Error:", message);  // Log error details

    res.status(statusCode).json({ message });
};

export default errorHandler;