import { useState } from "react";
// import { MdOutlineMovieCreation } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { signOut } from "@/apis/auth";

function Sidebar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-black transition-all duration-300 z-20 ${
        expanded ? "w-48" : "w-10"
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <nav className="flex flex-col h-full p-2 text-white gap-4 z-20">
        {/* 햄버거 아이콘 (사이드바 항상 표시) */}


        {/* 네비게이션 버튼들 */}
        <button
          className="hover:text-gray-300 flex items-center gap-2 p-2"
          onClick={() => navigate("/")}
        >
          홈
        </button>
        <button
          className="hover:text-gray-300 flex items-center gap-2 p-2"
          onClick={() => navigate("/movie")}
        >
          <p className="text-lg">영화 관리</p>
        </button>
        <button
          className="hover:text-gray-300 flex items-center gap-2 p-2"
          onClick={() => navigate("/poster")}
        >
          <p className="text-lg">포스터 관리</p>
          </button>
      
        <button
          className="flex text-red-400 hover:text-red-600 p-2"
          onClick={() => signOut()}
        >
          로그아웃
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;