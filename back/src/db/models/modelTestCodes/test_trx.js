// test trex - udr trx as query builder
// const getUSer = (user) =>
//   knex.transaction((trx) =>
//     // sql statment 1
//     trx("users")
//       .select("*")
//       .limit(1)
//       // sql statment 1 result, sql statement 2
//       .then((res) => {
//         console.log(res);
//         return trx("users").select("*").limit(2);
//       })
//       // sql statement 2 result
//       .then(console.log)
//   );
// getUSer();

// test trex - udr trx as query builder
// const getUSer2 = (user) =>
//   knex.transaction((trx) =>
//     // sql statment 1
//     knex("users")
//       .select("*")
//       .limit(1)
//       .transacting(trx)
//       // sql statment 1 result, sql statement 2
//       .then((res) => {
//         console.log(res);
//         return knex("users").select("*").limit(2).transacting(trx);
//       })
//       // sql statement 2 result
//       .then(console.log)
//   );
// getUSer2();

// const getUSer3 = (user) =>
//   knex.transaction(async (trx) => {
//     // sql statment 1
//     const res1 = await knex("users").select("*").limit(1).transacting(trx);
//     console.log(res1);
//     const res2 = await knex("users").select("*").limit(2).transacting(trx);
//     console.log(res2);
//   });
// getUSer3();

const getUSer4 = (user) =>
  knex.transaction(async (trx) => {
    // sql statment 1
    const res1 = await trx("users").select("*").limit(1);
    console.log(res1);
    const res2 = await trx("users").select("*").limit(2);
    console.log(res2);
  });
getUSer4();

// trx = knex.transaction() : transaction 객체를 가진 Promise를 반환하는 비동기 메서드
// Promise 형태로 트랜젝션 추가하기
//  trx.firstQuery().then((res)=>{return trx.secondQuery()}) : trx 객체를 쿼리빌더로 활용한 경우
//  knex.fistQuery().transacting(trx).then((res)=>{return ken.secondQuery().transacting(trx)}) 처럼 : trx를 객체로 활용한 경우
// 에러처리: .catch() , catch문으로 넘어오면 트랜젝션이 rollback 된다.
// async/await로 트랜젝션 추가하기
// const res = await trx.firstQuery(); const res2 = await trx.secondQeury() : trx 객체를 쿼리빌더로 활용한 경우
// transacting()은 transaction()으로 생성된 객체를 통해서만 호출될 수 있다.
// const res = await knex.firstQuery().transacting(trx); const res2 = await knex.secondQeury().transacting(trx) : trx를 객체로 활용한 경우
// 에러처리: try/catch, catch문으로 넘어오면 트랜젝션이 rollback 된다.

// 변환에 대한 고민..
// getUser는 서비스 코드여야 하고
const getUSer5 = () => {
  try {
    // 이렇게 매번 트랜젝션을 생성해주는 것이 맞다.
    knex.transaction(async (trx) => {
      // sql statment 1
      // 이렇게 쿼리 빌더문이 드러 날 수 없다.
      // 서비스 코드는 모델의 코드를 참조해서 쓰기 때문이다.
      // 이렇게 쓰려면, 모델 클라스에서 쿠리 문의 결과를 반환하는 대신 쿼리 빌더를 반환해야 한다.
      const res1 = await trx("users").select("*").limit(1);
      console.log(res1);
      const res2 = await trx("users").select("*").limit(2);
      console.log(res2);
    });
  } catch (err) {
    throw err;
  }
};
getUSer5();
