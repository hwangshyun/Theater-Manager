import { getUser } from "@/apis/auth";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { FaChevronUp } from "react-icons/fa";

function BasicLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUser();
      setUser(userData);
    }
    fetchUser();
  }, []);

  console.log(user?.user_metadata?.display_name);

  return (
    <div className="flex flex-col min-h-screen text-white">
      {/* 헤더 (항상 상단 고정) */}
      <header className="w-full  flex border-b border-gray-800 fixed top-0 bg-black bg-opacity-80 z-50 h-8  items-center">
        {/* 사이드바 트리거 (햄버거 버튼) */}
        <Sidebar />

        {/* 로고 및 제목 */}
        <h1
          className="text-xl font-semibold cursor-pointer select-none hover:scale transition-all duration-300 ml-2"
          onClick={() => navigate("/")}
        >
          THEATERMANAGER
        </h1>

        {/* 유저 정보 표시 */}
        <p className="ml-auto text-md  pr-4">
          {user?.user_metadata?.display_name ?? "정보 없음"}
        </p>
      </header>

      {/* 메인 콘텐츠 영역 (헤더 높이만큼 padding 추가) */}
      <main className=" pt-10 pb-8">
        <Outlet />
      </main>

      {/* 푸터 (항상 하단 고정) */}
      <footer className="w-full bg-black bg-opacity-80 flex justify-center items-center h-8 fixed bottom-0 z-50">
      <FaChevronUp />
      </footer>
    </div>
  );
}

export default BasicLayout;
