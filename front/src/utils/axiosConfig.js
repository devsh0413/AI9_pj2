import axios from "axios";

// axios config: axios 인스턴스 생성 시 사용되는 설정 객체
// axios가 HTTP 요청을 수행할 때 필요한 다양한 옵션을 지정.

const config = {
  baseURL: "http://localhost:5000", // API의 기본 URL
  headers: { "Content-Type": "application/json" }, // HTTP 헤더 설정
  timeout: 5000, // 요청 타임아웃(ms)
  withCredentials: true, // 크로스 도메인 요청 시에도 인증 정보를 포함할지 여부
};

export const api = axios.create(config); // 인스턴스 생성

// [Client] ------[ Interceptor ] -----> [Server]
api.interceptors.request.use(
  (req) => {
    //요청 data가 formData일때
    // console.log("req", req);
    if (req.data && req.data instanceof FormData) {
      req.headers["Content-Type"] = "application/json";
    }
    //요청 data가 Object일 때
    if (req.data && req.data instanceof Object) {
      req.headers["Content-Type"] = "application/json";
      req.data = JSON.stringify(req.data);
    }
    if (req.status >= 400 && req.status < 400) {
      console.log(`잘못된 요청입니다. ${req.status}`);
      // throw new Error("Error");
    }
    if (req.status < 500) {
      console.log(`에러가 발생하였습니다 ${req.status}`);
    }
    return req;
  },
  (err) => {
    // 400(Bad Requeset), 404(NotFound)
    console.log(err);
  }
);

// [Client] <------[ Interceptor ] ----- [Server]

api.interceptors.response.use((res) => {
  if (res.statusCode >= 400 && res.status < 500) {
    alert(`요청이 실패하였습니다: error code ${res.status} `);
  } else if (res.statusCode >= 500) {
    alert(`관리자에게 문의하세요.`);
  }
  return res;
});

export default api;
