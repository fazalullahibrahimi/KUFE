const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      console.error("AsyncHandler Error:", err.message || err.toString()); // Safe logging
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Something went wrong!",
      });
    });
  };
};

module.exports = asyncHandler;
