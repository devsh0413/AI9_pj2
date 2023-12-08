import axios from "axios";

// axios config: axios 인스턴스 생성 시 사용되는 설정 객체
// axios가 HTTP 요청을 수행할 때 필요한 다양한 옵션을 지정.

//인스턴스 생성
export const api = axios.create({
  baseURL: "http://" + window.location.hostname + ":5001", // API의 기본 URL
  //headers: { "Content-Type": "application/json" }, // HTTP 헤더 설정
  timeout: 5000, // 요청 타임아웃(ms)
  withCredentials: true, // 크로스 도메인 요청 시에도 인증 정보를 포함할지 여부
});

// [Client] ------[ Interceptor ] -----> [Server]
// 인터셉터: request
api.interceptors.request.use(
  function (request) {
    //요청 data가 formData일때
    if (request.data && request.data instanceof FormData) {
      request.headers["Content-Type"] = "multipart/form-data";
    }
    // 4xx 범위의 에러를 캐치(404말고는 거의 없을 것)
    if (request.status >= 400 && request.status < 500) {
      console.log(`잘못된 요청입니다. ${request.status}`);
      //alert("잘못된 요청입니다.");
    }

    return request;
  },
  (err) => {
    console.log(err);
  }
);

// [Client] <------[ Interceptor ] ----- [Server]
// 인터셉터: response

// 2xx 범위에 있는 상태 코드는 응답 데이터가 있는 작업 수행
api.interceptors.response.use(
  function (response) {
    return response.data;
  },
  // 2xx 외의 범위에 있는 상태 코드는 응답 오류가 있는 작업 수행.
  function (error) {
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 400:
          console.log("400 Bad Request. 요청을 다시 확인해주세요.");
          //alert("요청을 다시 확인해주세요.");
          break;
        case 401:
          console.log("401 Unauthorized. 인증이 필요합니다.");
          //console.log("인증이 필요합니다.");
          break;
        case 403:
          console.log("403 Forbidden. 접근 권한이 없습니다.");
          //alert("접근 권한이 없습니다.");
          break;
        case 404:
          console.log("404 Not Found. 존재하지 않는 페이지입니다.");
          //alert("존재하지 않는 페이지입니다.");
          break;
        default:
          return Promise.reject(error);
      }
    } else if (error.response.status >= 500) {
      alert("문제가 발생하였습니다. 관리자에게 문의하세요.");
    }
    return Promise.reject(error);
  }
);

export default api;
