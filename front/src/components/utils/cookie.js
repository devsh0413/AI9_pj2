export const setCookie = (cookie_name, value, days) => {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + days);
    // 설정 일수만큼 현재시간에 만료값으로 지정
  
    const cookie_value = JSON.stringify(value) + ((days == null) ? '' : '; expires=' + exdate.toUTCString());
    document.cookie = cookie_name + '=' + cookie_value;
  }

export const getCookie = () => {
    console.log('document.cookie', document.cookie);
    const userinfo = JSON.parse(document.cookie.split("=")[1]);
    return userinfo;
}
// 쿠키에서 데이터 읽기
// export default function Cookie() {
//     const value = {name: "yuyu", email: "ul1@ul.com"};
//     setCookie("userinfo", value, 1);

//     const userinfo = getCookie();
//     return userinfo;
// }
