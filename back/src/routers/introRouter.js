const { Router } = require("express");
const router = Router();
const knex = require("../db/knex");

//Knex Query Builder 사용하여 DB 연결
router.get("/", async (req, res, next) => {
  try {
    const result = await knex.select("*").from("intro");
    const data = JSON.parse(result[0].data); //json타입 으로 형변환
    console.log(data);
    res.status(200).json({
      message:
        "인포그래픽 데이터 전송 성공: [0]koreaTrashGraph, [1]worldOceanPlasticsGraph",
      data: [data.koreaTrashGraph, data.worldOceanPlasticsGraph],
    });
  } catch (error) {
    console.error("Error in introRouter", error.stack);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
