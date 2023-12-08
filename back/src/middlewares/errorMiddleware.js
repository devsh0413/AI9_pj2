const { ConflictError } = require("../lib/custom-error");
const errorMiddleware = (error, req, res, next) => {
  console.log("\x1b[33m%s\x1b[0m", error);
  const errorStr = JSON.stringify(error.message);
  if (errorStr.includes("ER_DUP_ENTRY")) {
    if (errorStr.includes("for key 'users.username'")) {
      error = new ConflictError("이미 사용중인 사용자명입니다.");
    } else if (errorStr.includes("for key 'users.email'")) {
      error = new ConflictError("이미 등록된 이메일입니다.");
    }
  }
  if (error.status) {
    res.status(error.status).send({
      statusCode: error.status,
      message: error.message,
    });
  } else {
    // 정의되지 않은 Error
    res.status(400).send({
      statusCode: 400,
      message: error.message,
    });
  }
};

module.exports = errorMiddleware;
