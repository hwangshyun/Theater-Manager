// import { useState, useEffect, useRef } from "react";
// import { useAuthStore } from "@/stores/authStore";
// import { getMovieList } from "@/apis/offer";
// import { Tables } from "@/types/supabase";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { uploadImageToSupabase } from "@/apis/supabase"; // ✅ Supabase 업로드 함수 추가
// import { FaUpload } from "react-icons/fa";

// // 영화 타입 정의
// type Movie = Tables<"movies">;

// function AddOffer() {
//   const user = useAuthStore((state) => state.user);
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [postImages, setPostImages] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);
//   const [fileNames, setFileNames] = useState<string[]>([
//     "이미지 파일을 선택하거나 복사 후 붙여넣으세요",
//   ]);
//   const [isCopied, setIsCopied] = useState<boolean>(false);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     if (user) {
//       getMovieList(user.id)
//         .then((data: Movie[]) => setMovies(data || []))
//         .catch(console.error);
//     }
//   }, [user]);

//   // 📌 클립보드에서 이미지 붙여넣기 감지
//   const checkClipboardForImage = async () => {
//     try {
//       const clipboardItems = await navigator.clipboard.read();
//       for (const item of clipboardItems) {
//         for (const type of item.types) {
//           if (type.startsWith("image/")) {
//             setIsCopied(true);
//             return;
//           }
//         }
//       }
//     } catch (error) {
//       console.warn("Clipboard API 사용 불가:", error);
//     }
//   };

//   useEffect(() => {
//     intervalRef.current = setInterval(checkClipboardForImage, 2000);

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, []);

//   // 📌 Supabase에 업로드 후 미리보기 URL 업데이트
//   const handleImageUpload = async (file: File) => {
//     if (!user) {
//       console.error("❌ 사용자 인증 필요");
//       return;
//     }

//     const uploadedUrl = await uploadImageToSupabase(file, user.id);
//     if (uploadedUrl) {
//       setPreviewUrls((prev) => [...prev, uploadedUrl]);
//     }
//   };

//   // 📌 여러 개의 파일 업로드 처리
//   const handleImageChange = async (files: FileList) => {
//     const newFiles = Array.from(files);
//     setPostImages((prev) => [...prev, ...newFiles]);
//     setFileNames((prev) => [...prev, ...newFiles.map((file) => file.name)]);

//     // Supabase에 업로드 후 URL 업데이트
//     for (const file of newFiles) {
//       await handleImageUpload(file);
//     }
//   };

//   // 📌 클립보드에서 이미지 붙여넣기 처리
//   const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
//     const items = e.clipboardData.items;
//     for (const item of items) {
//       if (item.type.startsWith("image/")) {
//         const file = item.getAsFile();
//         if (file) {
//           await handleImageUpload(file);
//         }
//       }
//     }
//     setIsCopied(false);
//   };

//   console.log(previewUrls);

//   return (
//     <div>
//       <h2>영화 목록</h2>
//       <Select>
//         <SelectTrigger>
//           <SelectValue placeholder="영화 선택" />
//         </SelectTrigger>
//         <SelectContent>
//           {movies.map((movie) => (
//             <SelectItem key={movie.id} value={movie.id} className="cursor-pointer">
//               {movie.title}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//       <Input type="text" placeholder="제공 주차" />
//       <Input type="text" placeholder="제공 주차" />

//       {/* 파일 업로드 */}
//       <div className="flex flex-col" onPaste={handlePaste}>
//         <label
//           htmlFor="fileUpload"
//           className="flex items-center justify-between bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-2 rounded-md cursor-pointer border border-gray-600"
//         >
//           <FaUpload className="mr-2" /> 여러 개의 이미지를 선택하거나 붙여넣으세요
//         </label>
//         <input
//           id="fileUpload"
//           type="file"
//           accept="image/*"
//           multiple
//           className="hidden"
//           onChange={(e) => e.target.files && handleImageChange(e.target.files)}
//         />

//         {/* 미리보기 */}
//         <div className="flex flex-wrap gap-2 mt-2">
//           {previewUrls.map((url, index) => (
//             <div key={index} className="relative">
//               <img src={url} alt="미리보기" className="max-h-40 max-w-40 rounded-md border border-gray-600" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddOffer;