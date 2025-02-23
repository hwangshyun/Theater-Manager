import { BrowserRouter, Route, Routes } from "react-router-dom";
import Poster from "../pages/poster";
import Login from "../pages/auth";
import Movie from "@/pages/movie";
import BasicLayout from "@/pages/layout/basic.layout";
import MainPage from "@/pages/main";
import Test from "@/pages/test";

function DefaultRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BasicLayout />}>
          <Route path="/poster" element={<Poster />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movie" element={<Movie />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/" />{" "}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default DefaultRoutes;
