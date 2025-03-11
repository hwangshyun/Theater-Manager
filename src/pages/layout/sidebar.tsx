import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "@/apis/auth";
import { MdHome, MdMovie, MdImage, MdLogout } from "react-icons/md"; // 아이콘 추가

function Sidebar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-black ㅠㅐ transition-all duration-300 z-20 flex flex-col items-center
        ${expanded ? "w-48" : "w-4"}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <nav className="flex flex-col h-full p-2 text-white gap-4 w-full">
        
        {/* 홈 버튼 */}
        <button
          className="hover:text-gray-300 flex items-center gap-3 p-2 w-full"
          onClick={() => navigate("/")}
        >
          <MdHome className="w-" />
          {expanded && <p className="text-lg">홈</p>}
        </button>

        {/* 영화 관리 버튼 */}
        <button
          className="hover:text-gray-300 flex items-center gap-3 p-2 w-full"
          onClick={() => navigate("/movie")}
        >
          <MdMovie className="text-2xl" />
          {expanded && <p className="text-lg">영화 관리</p>}
        </button>

        {/* 포스터 관리 버튼 */}
        <button
          className="hover:text-gray-300 flex items-center gap-3 p-2 w-full"
          onClick={() => navigate("/poster")}
        >
          <MdImage className="text-2xl" />
          {expanded && <p className="text-lg">포스터 관리</p>}
        </button>

        {/* 로그아웃 버튼 */}
        <button
          className="flex items-center gap-3 text-red-400 hover:text-red-600 p-2 w-full mt-auto mb-10"
          onClick={() => signOut()}
        >
          <MdLogout className="text-2xl" />
          {expanded && <p className="text-lg">로그아웃</p>}
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;