import { getUser } from "@/apis/auth";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

function BasicLayout() {

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
    <div className="flex flex-col min-h-screen text-white ">
      {/* 헤더 (항상 상단 고정) */}
     <Sidebar />

      {/* 메인 콘텐츠 영역 (헤더 높이만큼 padding 추가) */}
      <main className="">
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
