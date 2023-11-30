const errorMiddleware = (error, req, res, next) => {
  console.log("\x1b[33m%s\x1b[0m", error);
  if (error.status) {
    res.status(error.status).send({
      statusCode: error.status,
      message: error.message,
      data: {},
    });
  } else {
    // 정의되지 않은 Error
    res.status(400).send({
      statusCode: 400,
      message: error.message,
      data: {},
    });
  }
};

module.exports = errorMiddleware;
