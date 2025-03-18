import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "@/apis/auth";
import { MdHome, MdMovie, MdImage, MdLogout } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";

function Sidebar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "fixed left-0 top-0 border-r border-gray-900 h-full bg-black flex flex-col pt-8 items-start transition-all duration-300 ease-in-out shadow-lg z-20",
        expanded ? "w-36" : "w-10"
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <nav className="flex flex-col gap-3 w-full items-start">
        <SidebarItem
          icon={<MdHome />}
          label="홈"
          onClick={() => navigate("/")}
          expanded={expanded}
        />
        <SidebarItem
          icon={<MdMovie />}
          label="영화 관리"
          onClick={() => navigate("/movie")}
          expanded={expanded}
        />
        <SidebarItem
          icon={<MdImage />}
          label="포스터 관리"
          onClick={() => navigate("/poster")}
          expanded={expanded}
        />

        <div className="mt-auto w-full">
          <SidebarItem
            icon={<MdLogout className="text-red-400" />}
            label="로그아웃"
            onClick={signOut}
            expanded={expanded}
            className="text-red-400 hover:text-red-500"
          />
        </div>
      </nav>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  onClick,
  expanded,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  expanded: boolean;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "relative flex items-center text-lg text-white hover:bg-gray-700 py-2 pl-2 rounded-md transition-all duration-300 ease-in-out w-full",
        expanded ? "justify-start" : "justify-center",
        className
      )}
      onClick={onClick}
    >
      {/* 아이콘 */}
      <span className="text-xl flex-shrink-0">{icon}</span>
      {/* 텍스트 (축소 시 숨김) */}
      <span
        className={cn(
          "absolute left-10 text-base whitespace-nowrap opacity-0 transition-opacity duration-300 ease-in-out",
          expanded && "opacity-100"
        )}
      >
        {label}
      </span>
    </Button>
  );
}

export default Sidebar;