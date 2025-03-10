import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
// import { MdOutlineMovie } from "react-icons/md";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { getUser } from "@/apis/auth";

function MainPage() {
  const navigate = useNavigate();
  const [showPeekaboo, setShowPeekaboo] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUser();
      setUser(userData);
    }
    fetchUser();
  }, []);


  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.8, ease: "easeOut" },
    }),
  };
  const items = [
    { type: "text", content: "안녕하세요" },

    { type: "text", content: user?.user_metadata?.display_name ?? "성민이" },
        { type: "image", content: "/file.png" },
  ];
  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // ✅ 버튼이 0.2초 간격으로 순차적 등장
      },
    },
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      {/* 좌측 애니메이션 텍스트 */}
      <img src="/adobe-express-qr-code.png" alt="" className="absolute top-24 left-24 size-16 object-cover z-0" />
      <div className="flex flex-col gap-8 text-gray-300 text-6xl font-extrabold mr-80">
        {items.map((item, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.3, color: "#ffffff" }}
            transition={{ type: "spring", stiffness: 80 }}
            variants={textVariants}
            className="flex justify-center  transition-all duration-300 cursor-default"
          >
            {item.type === "text" ? (
              item.content
            ) : (
              <motion.img
                src={item.content}
                alt="Uploaded"
                className="max-w-80 shadow-lg rounded-full cursor-pointer"
                whileHover={{
                  scale: 2.0, // ✅ 이미지 확대 효과
                  opacity: 1.0, // ✅ 살짝 투명도 조정
                  // ✅ 그림자 효과 추가
                }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                onClick={() => setShowPeekaboo(true)}
              />
            )}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {showPeekaboo && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPeekaboo(false)}
          >
            <motion.h1
              className="text-white text-9xl font-extrabold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              까꿍~~
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 기존 콘텐츠 (카드 컨테이너) */}
      <motion.div
    className="flex flex-col gap-20"
    variants={buttonContainerVariants}
    initial="hidden"
    animate="visible"
  >
    {[
      { label: "영화관리", link: "/movie" },
      { label: "포스터 관리", link: "/poster" },
      // { label: "공지사항", link: "/notice" },
      { label: "특전 관리", link: "/offer" },
      // { label: "영화 관리", link: "/movie" },
    ].map((item, index) => (
      <motion.div
        key={index}
        onClick={() => navigate(item.link)}
        className="cursor-pointer border-none  flex flex-col items-center justify-center  bg-transparent rounded-lg bg-opacity-20  transition-all duration-50"
        variants={buttonVariants}
        whileHover={{ scale: 1.1, backgroundColor: "transparent",  }} // ✅ 자연스러운 호버 효과
      >
        <h1 className="text-gray-300 text-7xl font-extrabold">{item.label}</h1>
      </motion.div>
    ))}
  </motion.div>
    </div>
  );
}

export default MainPage;
