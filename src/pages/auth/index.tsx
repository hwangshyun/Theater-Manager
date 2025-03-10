import React, { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion"; // ✅ Framer Motion 추가
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    console.log("로그인 시도:", email, password);
    await login(email, password);
    console.log("로그인 성공!");
    
    await fetchUser(); // 세션 초기화
    console.log("유저 정보 가져오기 완료");

    alert("로그인 성공!");
    console.log("Navigating to main page...");
    navigate("/"); // 메인 페이지로 이동
  } catch (error) {
    console.error("로그인 실패:", (error as Error).message);
    alert(`로그인 실패: ${(error as Error).message}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <motion.div
        initial={{ opacity: 0, y: 50 }} // 처음에는 아래에 있음
        animate={{ opacity: 1, y: 0 }} // 위로 올라오면서 페이드 인
        transition={{ duration: 0.6, ease: "easeOut" }} // 애니메이션 속도
      >
        <Card className="w-full max-w-md shadow-lg p-10 border-none">
          <CardHeader>
            <CardTitle className="text-center text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white drop-shadow-lg shadow-black mb-12">
              LOGIN
            </CardTitle>{" "}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <Input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-white w-80 border-gray-500"
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-white w-80 border-gray-500"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full
                border
                border-gray-500
                text-white font-bold text-lg py-2 rounded-md 
             bg-gradient-to-r from-gray-500 to-white shadow-lg 
             hover:brightness-110 hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "로그인"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
