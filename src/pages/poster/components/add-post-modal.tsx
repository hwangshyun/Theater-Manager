import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AiOutlineExport } from "react-icons/ai";
import { FaUpload } from "react-icons/fa";

interface AddPostModalProps {
  onSubmit: (title: string, content: string, image?: string | null) => void;
}

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

function AddPostModal({ onSubmit }: AddPostModalProps) {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>(
    "이미지 파일을 선택하거나 복사 후 붙여넣으세요"
  );
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // ✅ 인터벌 추적

  const checkClipboardForImage = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            setIsCopied(true);
            setFileName("이미지를 붙여넣으세요.");
            return;
          }
        }
      }
    } catch (error) {
      console.warn("Clipboard API 사용 불가:", error);
    }
  };

  useEffect(() => {
    // ✅ 인터벌 시작
    intervalRef.current = setInterval(checkClipboardForImage, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleImageChange = async (file: File) => {
    if (file) {
      setPostImage(file);
      setIsCopied(false); // ✅ 파일 업로드 시 붙여넣기 상태 해제
      setFileName(file.name); // ✅ 올바른 파일명 표시
      const base64Url = await convertFileToBase64(file);
      setPreviewUrl(base64Url);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          await handleImageChange(file);
          setFileName("붙여넣기 완료!");
          setIsCopied(false);

          // ✅ 붙여넣기 완료 후 인터벌 정지
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }
    }
  };

  const handlePostSubmit = async () => {
    if (!postTitle.trim()) {
      alert("게시물 제목을 입력하세요.");
      return;
    }

    let imageUrl = null;
    if (postImage) {
      imageUrl = await convertFileToBase64(postImage);
    }

    onSubmit(postTitle, postContent, imageUrl);

    setPostTitle("");
    setPostContent("");
    setPostImage(null);
    setPreviewUrl(null);
    setFileName("이미지 파일을 선택하거나 복사 후 붙여넣으세요");
    setIsCopied(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-900 bg-opacity-80 border border-gray-600 rounded-sm hover:bg-gray-800 hover:bg-opacity-80 hover:border-gray-500">
          <AiOutlineExport />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-sm bg-gray-800 bg-opacity-80 border border-gray-700 p-4 rounded-md"
        onPaste={handlePaste}
      >
        <DialogHeader>
          <DialogTitle className="text-sm text-white">
            기타 게시물 추가
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {/* 제목 입력 */}
          <p className="text-xs text-white">제목</p>
          <input
            placeholder=" 예) 주차안내 , 화장실안내"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="text-xs bg-gray-900 text-white bg-opacity-80 px-3 py-2 rounded-md w-full border border-gray-700 outline-none focus:ring-2 focus:ring-gray-600"
          />
          {/* 내용 입력 */}
          <input
            placeholder="내용을 입력하세요. 필수는 아닙니다."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="text-xs bg-gray-900 text-white bg-opacity-80 px-3 py-2 rounded-md w-full border border-gray-700 outline-none focus:ring-2 focus:ring-gray-600"
          />

          {/* 파일 업로드 UI */}
          <div className="flex flex-col">
            <label
              htmlFor="fileUpload"
              className={`flex items-center justify-between bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-2 rounded-md cursor-pointer border border-gray-600 ${
                isCopied ? "" : ""
              }`}
            >
              <div className="flex flex-col items-center">
                <p>{fileName}</p>
                {previewUrl && (
                  <div className="flex justify-center">
                    <img
                      src={previewUrl}
                      alt="미리보기"
                      className="justify-center mt-2 max-h-80 max-w-full h-auto rounded-md border border-gray-600"
                    />
                  </div>
                )}
              </div>
              {!isCopied && <FaUpload className="hidden" />}
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleImageChange(e.target.files[0])
              }
            />
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-2 mt-3">
            <DialogClose asChild>
              <Button
                className="bg-gray-800 p-2 bg-opacity-80 border border-gray-600 rounded-sm hover:bg-gray-800 hover:bg-opacity-80 hover:border-gray-500"
                onClick={() => {
                  setPostTitle("");
                  setPostContent("");
                  setPostImage(null);
                  setPreviewUrl(null);
                  setFileName("이미지 파일을 선택하거나 복사 후 붙여넣으세요");
                  setIsCopied(false);
                }}
              >
                취소
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                className="bg-gray-900 bg-opacity-70 border border-gray-700  hover:bg-gray-700 hover:bg-opacity-80 hover:border-gray-500"
                onClick={handlePostSubmit}
              >
                게시하기
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddPostModal;
