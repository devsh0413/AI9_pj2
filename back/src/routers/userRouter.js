const userRouter = require("express").Router();
const knex = require("../db/knex");
const UsersModel = require("../db/models/users");
const users = new UsersModel(knex);
const {
  NotFoundError,
  INVALID_USER_Error,
  ConflictError,
} = require("../lib/custom-error");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isLoggedIn = require("../middlewares/isLoggedIn.js");

// GET /users/login
userRouter.post("/users/login", async (req, res, next) => {
  try {
    // 요청 바디 데이터 받아오기
    const { email, password } = req.body;

    // DB: user_id로 유저 조회
    const result = await users.findByEmail(email);
    const user = result[0];

    // user 유무 검증
    if (!user) {
      throw new INVALID_USER_Error("등록되지 않은 이메일입니다.");
    }

    // password 검증
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );
    if (!isPasswordCorrect) {
      throw new INVALID_USER_Error("잘못된 비밀번호입니다.");
    }

    // jwt 생성
    const accessToken = await jwt.sign(
      { user_id: user.user_id, username: user.username, email: user.email },
      process.env.JWT_SECRET_KEY,
      {
        algorithm: "HS256", // 암호화 알고리즘
        expiresIn: 60 * 60 * 24, // 유효기간
      }
    );

    // cookie 전송
    const cookieOption = {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    };
    res.cookie("accessToken", accessToken, cookieOption);
    // 응답
    res.status(200).send({
      message: "로그인 성공",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });

    // OR
    // passport.authenticate() 함수 호출하여 후속처리
  } catch (err) {
    next(err);
  }
});

// GET /users/user
userRouter.get("/users/user", isLoggedIn, async (req, res, next) => {
  try {
    // 요청 쿠키 데이터 가져오기
    const user_id = req.currentUserId;

    // DB:  user_id로 users 조회
    const result = await users.findById(user_id);

    // 빈 배열일 경우 에러처리
    if (result.length === 0) {
      throw new NotFoundError("데이터가 존재하지 않습니다.");
    }

    // 응답 데이터 구성하기
    delete result[0].password;

    // 응답
    res.status(200).send({
      statusMessage: "DB 데이터 조회 성공",
      user: result,
    });
  } catch (err) {
    next(err);
  }
});

// GET /users
userRouter.get("/users", async (req, res, next) => {
  try {
    // DB: 모든 users 조회
    let userArr = await users.findById();

    // 응답 데이터 구성하기
    userArr = userArr.map((user) => {
      delete user.password;
      return user;
    });

    // 빈 배열일 경우 에러처리
    if (userArr.length === 0) {
      throw new NotFoundError("데이터가 존재하지 않습니다.");
    }

    // 응답
    res.status(200).send({
      message: "db 조회 성공",
      users: userArr,
    });
  } catch (err) {
    next(err);
  }
});

// POST /users
userRouter.post("/users", async (req, res, next) => {
  try {
    // 요청 바디 데이터 가져오기
    const { username, email, password } = req.body;

    // 응답 데이터 구성하기
    const user_id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      user_id,
      username,
      email,
      password: hashedPassword,
      level: 0,
    };

    // DB: user 데이터 DB에 추가하기
    const result = await users.create(newUser); //왜 반환 값이 0이 나올까?..

    //응답
    res.status(200).send({
      message: "DB 데이터 추가 성공",
    });
  } catch (err) {
    const errStr = JSON.stringify(err.message);
    if (errStr.includes("ER_DUP_ENTRY")) {
      if (errStr.includes("for key 'users.username'")) {
        next(new ConflictError("이미 사용중인 사용자명입니다."));
      } else if (errStr.includes("for key 'users.email'")) {
        next(new ConflictError("이미 등록된 이메일입니다."));
      }
    }
    next(err);
  }
});

// DELETE /users
userRouter.delete("/users", isLoggedIn, async (req, res, next) => {
  try {
    // cookie에서 user_id 받아오기

    const user_id = req.currentUserId;
    // DB: db 데이터 삭제
    const result = await users.deleteById(user_id);

    //응답
    res.status(200).end({
      statusCode: 200,
      message: "DB 데이터 삭제 성공",
    });
  } catch (err) {
    next(err);
  }
});

// UPDATE /users
userRouter.put("/users", isLoggedIn, async (req, res, next) => {
  try {
    // 요청 쿠키, 바디에서 값 받아오기
    const user_id = req.currentUserId;
    const toUpdate = { ...req.body };

    // DB: DB 데이터 수정하기
    const result = await users.update(user_id, toUpdate);

    // 응답
    res.status(200).send({
      message: "DB 데이터 수정 성공",
    });
    console.log(result);
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
