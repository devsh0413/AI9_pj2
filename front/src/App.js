import React, { Suspense, useContext, useEffect } from "react";
import { UserDispatchContext } from "./Context/UserStateContext";
import Navigation from "./components/common/header/Navigation";
import { Routes, Route, useLocation } from "react-router-dom";
import LoadingPage from "./components/common/header/LoadingPage";
import api from "./components/utils/axiosConfig";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "./components/utils/errorBoundary"

const IntroPage = React.lazy(() => import("./components/pages/IntroPage"));
const LoginPage = React.lazy(() => import("./components/pages/LoginPage"));
const RegisterPage = React.lazy(() =>
  import("./components/pages/RegisterPage")
);
const HabitPage = React.lazy(() => import("./components/pages/HabitPage"));
const CommunityPage = React.lazy(() =>
  import("./components/pages/CommunityPage")
);
const CalendarPage = React.lazy(() =>
  import("./components/pages/CalendarPage")
);
const UserPage = React.lazy(() => import("./components/pages/UserPage"));


export default function App() {

  const location = useLocation();
  const dispatch = useContext(UserDispatchContext);

  const cookieCheck = () => {
    api.get("/users/user")
      .then((res) => {
        const user = res.user[0];
        console.log(res);
        dispatch({
          type: "COOKIE_CHECK",
          payload: user,
        });
      })
      .catch(() => {
        console.log("쿠키 없음❌")
      })
  };

  useEffect(() => {
    if (location.pathname === '/register' || location.pathname === '/login') return;
    if (location.pathname === '/') {
      setTimeout(() => {
        cookieCheck();
      },1000)
    } else {
      cookieCheck();
    }
  },[location.pathname])

  return (
    <>
      <Navigation />
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
          <Suspense fallback={<LoadingPage/>}>
            <Routes>
              <Route path="/" element={<IntroPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/userpage" element={<UserPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/habit" element={<HabitPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="*" element={<IntroPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
    </>
  );
}
