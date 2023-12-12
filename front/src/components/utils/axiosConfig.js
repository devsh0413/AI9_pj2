import axios from "axios";


export const api = axios.create({
  baseURL: "http://" + window.location.hostname + ":5001", 
  timeout: 5000,
  withCredentials: true,
});

// [Client] ------[ Interceptor ] -----> [Server]
api.interceptors.request.use(
  function (request) {
    if (request.data && request.data instanceof FormData) {
      request.headers["Content-Type"] = "multipart/form-data";
    }
    if (request.status >= 400 && request.status < 500) {
      console.log(`잘못된 요청입니다. ${request.status}`);
    }

    return request;
  },
  (err) => {
    console.log(err);
  }
);

// [Client] <------[ Interceptor ] ----- [Server]
api.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 400:
          console.log("400 Bad Request. 요청을 다시 확인해주세요.");
          break;
        case 401:
          console.log("401 Unauthorized. 인증이 필요합니다.");
          break;
        case 403:
          console.log("403 Forbidden. 접근 권한이 없습니다.");
          break;
        case 404:
          console.log("404 Not Found. 존재하지 않는 페이지입니다.");
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
