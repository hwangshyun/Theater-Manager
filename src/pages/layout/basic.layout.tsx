import { useEffect, useState } from "react";
import { getUser } from "@/apis/auth";
import { Outlet, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

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
      <header className="w-full px-2  flex border-b border-gray-700 fixed top-0  bg-black bg-opacity-80 z-50">
        {" "}
        <h1
          className="text-2xl font-bold cursor-pointer select-none hover:scale transition-all duration-300 flex items-center"
          onClick={() => navigate("/")}
        >
          THEATERMANAGER
        </h1>
        {/* <p className="ml-4">지점: {user?.user_metadata?.display_name ?? "정보 없음"}</p> */}
        <p className="ml-auto text-md font-semibold mr-2 pt-6">{user?.user_metadata?.display_name ?? "정보 없음"}</p>
      </header>

      {/* 메인 콘텐츠 영역 (헤더 높이만큼 padding 추가) */}
      <main className="flex-1 mt-16 min-h-screen mb-16">
        <Outlet />
      </main>

      {/* 푸터 (항상 하단 고정) */}
      <footer className="w-full  bg-black bg-opacity-80 text-center py-2 fixed bottom-0 z-50">
        <p>뭐가들어가면좋을까</p>
      </footer>
    </div>
  );
}

export default BasicLayout;
