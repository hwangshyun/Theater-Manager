import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"; // ShadCN 사이드바
import { Button } from "@/components/ui/button"; // ShadCN 버튼
import { Menu } from "lucide-react"; // 햄버거 아이콘
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div>
      {" "}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="text-white hover:bg-gray-700  rounded-md"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        {/* 사이드바 콘텐츠 */}
        <SheetContent side="left" className="bg-gray-900 bg-opacity-80 text-white w-48 border-r border-gray-800">
          <nav className="flex flex-col gap-4 p-4">
            <button
              className="text-lg hover:text-gray-300"
              onClick={() => navigate("/")}
            >
              홈
            </button>
            <button
              className="text-lg hover:text-gray-300"
              onClick={() => navigate("/movie")}
            >
              영화 관리
            </button>
            <button
              className="text-lg hover:text-gray-300"
              onClick={() => navigate("/poster")}
            >
              포스터 관리
            </button>
            <button
              className="text-lg hover:text-gray-300"
              onClick={() => navigate("/settings")}
            >
              설정
            </button>
            <button
              className="mt-4 text-lg text-red-400 hover:text-red-600"
              onClick={() => console.log("로그아웃 기능 구현")}
            >
              로그아웃
            </button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Sidebar;
