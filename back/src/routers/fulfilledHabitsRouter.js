const fulfilledRouter = require("express").Router();
const fulfilledService = require("../services/fulfilledHabitsService");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const { stringToArr } = require("../lib/stringToarray.js");

fulfilledRouter.get("/", isLoggedIn, async (req, res, next) => {
  try {
    //쿼리 파라미터 받아오기
    const { month, date } = req.query;
    //쿠키에서 유저 정보 받아오기
    const userId = req.currentUserId;

    //쿼리파라미터 중 month 가 사용된 경우
    if (month) {
      //캘린더에 표시된 month 에 따라 습관을 실천한 모든 날짜를 조회
      const monthData = await fulfilledService.getDatesByMonth(userId, month);
      //주차별 실천한 습관 수 카운팅
      const weekData = await fulfilledService.getCountsByWeeks(userId);
      res.status(200).json({
        message: `${month}월에 습관을 실천한 날짜 목록 조회 성공`,
        dates: monthData,
        counts: weekData,
      });
    }
    //쿼리 파라미터 중 date 가 사용된 경우
    else if (date) {
      //캘린더에서 선택한 날짜에 실천한 습관 id 조회
      const data = await fulfilledService.getHabitsByDate(userId, date);
      res.status(200).json({
        message: `${date}에 실천한 습관 id 조회 성공`,
        habitIds: data,
      });
    }
    //쿼리 파라미터가 사용되지 않은 경우
    else {
      //오늘 날짜를 사용하여 오늘 실천합 습관 목록 조회
      const data = await fulfilledService.getHabitsByToday(userId);
      res.status(200).json({
        message: `오늘 실천한 습관 id 조회 성공`,
        habitsId: data,
      });
    }
  } catch (error) {
    next(error);
  }
});

fulfilledRouter.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const userId = parseInt(req.currentUserId);
    const checked = req.body; //실천 체크한 습관
    if (typeof checked.fulfilledHabits === "string") {
      checked.fulfilledHabits = stringToArr(checked.fulfilledHabits);
    }
    await fulfilledService.addFulfilledHabits(userId, checked);
    res.status(200).json({ message: "습관 실천 내역 저장 성공" });
  } catch (error) {
    next(error);
  }
});

fulfilledRouter.delete("/", isLoggedIn, async (req, res, next) => {
  try {
    const userId = parseInt(req.currentUserId);
    let habitIds = req.body.fullfilledHabitId;
    if (typeof habitIds === "string") {
      habitIds = stringToArr(habitIds);
    }
    console.log(habitIds);
    await fulfilledService.deleteFulfilledHabits(userId, habitIds);
    res.status(200).json({ message: "습관 실천 취소 성공" });
  } catch (error) {
    next(error);
  }
});

module.exports = fulfilledRouter;
