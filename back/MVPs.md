[turtine 기능]

1. IntroMVP (인포그래픽 기능)
   1. csv 파일, json 형태로 변환해서 보내기

---

1. UserMVP (로그인,회원가입,수정,탈퇴 기능)
   1. 로그인 및 유지 기능 - users TABLE / GET
   2. 회원가입 기능 - users TABLE / POST
   3. 회원정보 수정 - users TABLE / PUT
   4. 현재 로그인 사용자의 정보 수정하기 - users TABLE / GET
   5. 회원 탈퇴 기능 - users TABLE / DELETE

---

1. LevelMVP (레벨 기능)
   1. 거북이 컴포넌트(사용자레벨 조회) - user TABLE / GET
   2. 사용자 레벨 업데이트 - user TABLE / PUT

---

1. DailyHabitMVP (습관 추가, 수정 / 실천습관 (기본)조회, (체크했을 때)추가, (체크풀었을 때)삭제 )
   1. 습관 목록 컴포넌트
      - 현재 로그인한 사용자가 실천하고 있는 습관 목록 - planned_habits TABLE / GET, POST, (DELETE) - 배열로 받아온다.
      - 현재 로그인한 사용자가 실천한 습관 체크 표시 - fullfilled_habits TABLE / GET, POST, DELETE - 배열로 받아온다. 12시정각에

---

1. CalenderMVP
   - 달력 - fullfilled_habit TABLE / GET

---

1. CommunityMVP
   - 모든 사용자의 레벨 전시 - users TABLE(수정) / GET
