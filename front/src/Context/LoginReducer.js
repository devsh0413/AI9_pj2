
export default function LoginReducer(userState, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      console.log("로그인 성공!");
      return {
        ...userState,
        user: action.payload,
      };
    case "COOKIE_CHECK":
      console.log("쿠키 있음 🍪");
      return {
        ...userState ,
        user: action.payload,
      };
    case "USERINFO_EDIT":
      console.log("유저 정보 수정!");
      return {
        ...userState ,
        user: action.payload,
      };
    case "LOGOUT":
      console.log("로그아웃!");
      return {
        ...userState,
        user : null ,
      };
    default:
      return userState;
  }
}
