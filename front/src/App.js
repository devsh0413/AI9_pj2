import React, { Suspense } from "react";
import { UserProvider } from "./Context/UserStateContext";
import Navigation from "./components/common/header/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
  return (
    <UserProvider>
      <BrowserRouter>
        <Navigation />
        <Suspense fallback={<div>Loading...</div>}>
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
      </BrowserRouter>
    </UserProvider>
  );
}
