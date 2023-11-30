const { Router } = require("express");
const connectDB = require("../middlewares/connectDB");
const router = Router();

// router.get("/", connectDB, async (req, res, next) => {
//   try {
//     //http://localhost:5001/fulfilled_habits?month=2023-11 같은 형태의 쿼리일 때
//     const { month } = req.query; //yyyy-MM

//     const nextmonth =
//       month.slice(5, 7) == 12 //쿼리로 들어온 달이 12월이면
//         ? `${parseInt(month.slice(0, 4)) + 1}-01` //다음 해 01월
//         : `${month.slice(0, 4)}-${parseInt(month.slice(5, 7)) + 1}`; //아니면 같은 해 다음달

//     //const { user_id } = req.cookies; //쿠키에서 user 정보 가져옴
//     const user_id = "123abc"; //로그인 기능 연결 전 임시 변수
//     const result = await req.dbConnection
//       .select("date")
//       .from("fulfilled_habits")
//       .where({
//         user_id: user_id,
//       })
//       .where("date", ">=", `${month}-01`)
//       .where("date", "<", `${nextmonth}-01`);
//     console.log(result);
//     const data = result.map((el) => el.date);
//     res.status(200).json({
//       status: 200,
//       message: `${month}월에 습관을 실천한 날짜 목록 조회 성공`,
//       data: data,
//     });
//   } catch (error) {
//     console.error("Error in calenderRouter", error.stack);
//     res.status(500).json({
//       status: 500,
//       message: "Internal Server Error",
//       data: null,
//     });
//   }
// });

// //쿼리 파라미터가 다르고 같은 경로로 접근하는 API를 구분하지 못하는 이슈 때문에 임의로 /calender 라고 경로 추가
// router.get("/calender", connectDB, async (req, res, next) => {
//   try {
//     //http://localhost:5001/fulfilled_habits?month=2023-11-29 같은 형태의 쿼리일 때
//     const { date } = req.query; //yyyy-MM-dd
//     //const { user_id } = req.cookies; //쿠키에서 user 정보 가져옴
//     const user_id = "123abc"; //로그인 기능 연결 전 임시 변수

//     const result = await req.dbConnection
//       .select("habits.habit_title")
//       .from("fulfilled_habits")
//       .join("habits", "fulfilled_habits.habit_id", "=", "habits.habit_id")
//       .where("fulfilled_habits.user_id", "=", user_id)
//       .andWhere("fulfilled_habits.date", "=", date);
//     console.log(result);
//     const data = result.map((row) => row.habit_title);
//     res.status(200).json({
//       status: 200,
//       message: `${date} 에 실천한 습관 목록 조회 성공`,
//       data: data,
//     });
//   } catch (error) {
//     console.error("Error in calenderRouter", error.stack);
//     res.status(500).json({
//       status: 500,
//       message: "Internal Server Error",
//       data: null,
//     });
//   }
// });

router.get("/", connectDB, async (req, res, next) => {
  try {
    const { month, date } = req.query;
    //const { user_id } = req.cookies; //쿠키에서 user 정보 가져옴
    const user_id = "123abc"; //로그인 기능 연결 전 임시 변수
    if (month) {
      const nextmonth =
        month.slice(5, 7) == 12 //쿼리로 들어온 달이 12월이면
          ? `${parseInt(month.slice(0, 4)) + 1}-01` //다음 해 01월
          : `${month.slice(0, 4)}-${parseInt(month.slice(5, 7)) + 1}`; //아니면 같은 해 다음달
      const result = await req.dbConnection
        .select("date")
        .from("fulfilled_habits")
        .where({
          user_id: user_id,
        })
        .where("date", ">=", `${month}-01`)
        .where("date", "<", `${nextmonth}-01`);
      console.log(result);
      const data = result.map((el) => el.date);
      res.status(200).json({
        status: 200,
        message: `${month}월에 습관을 실천한 날짜 목록 조회 성공`,
        data: data,
      });
    } else if (date) {
      const result = await req.dbConnection
        .select("habits.habit_title")
        .from("fulfilled_habits")
        .join("habits", "fulfilled_habits.habit_id", "=", "habits.habit_id")
        .where("fulfilled_habits.user_id", "=", user_id)
        .andWhere("fulfilled_habits.date", "=", date);
      console.log(result);
      const data = result.map((row) => row.habit_title);
      res.status(200).json({
        status: 200,
        message: `${date} 에 실천한 습관 목록 조회 성공`,
        data: data,
      });
    } else {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      console.log(today);
      console.log(tomorrow);
      const result = await req.dbConnection
        .select("*")
        .from("fulfilled_habits")
        .where({
          user_id: user_id,
        })
        .where("date", ">=", today.toISOString().slice(0, 10))
        .where("date", "<", tomorrow.toISOString().slice(0, 10));
      console.log(result);
      res.json(result);
    }
  } catch (error) {}
});

module.exports = router;
