import { BrowserRouter, Route, Routes } from "react-router-dom";
import Poster from "../pages/poster";
import Login from "../pages/auth";
import Movie from "@/pages/movie";
import BasicLayout from "@/pages/layout/basic.layout";
import Offer from "@/pages/offer";
import SignUp from "@/pages/signup";
import RequireAuth from "@/pages/auth/components/RequireAuth";
import MainPage from "@/pages/main";

function DefaultRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 안 해도 접근 가능한 페이지 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* 로그인한 유저만 접근 가능한 페이지 */}
        <Route element={<RequireAuth />}>
          <Route element={<BasicLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/poster" element={<Poster />} />
            <Route path="/offer" element={<Offer />} />
            <Route path="/movie" element={<Movie />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default DefaultRoutes;