import { useState } from "react";
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

interface AddPostModalProps {
  onSubmit: (title: string, content: string) => void;
}

function AddPostModal({ onSubmit }: AddPostModalProps) {
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
  
    const handlePostSubmit = () => {
        console.log("🟢 AddPostModal 내부 handlePostSubmit 실행됨");
        console.log("제목:", postTitle);
        console.log("내용:", postContent);
        console.log("전달될 onSubmit 함수:", onSubmit);
      
        if (!postTitle.trim()) {
          alert("게시물 제목을 입력하세요.");
          return;
        }
      
        onSubmit(postTitle, postContent); // 🔹 PosterList의 handlePostSubmit 호출
      
        setPostTitle("");
        setPostContent("");
      };
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="">
            <AiOutlineExport className="" />
            
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm bg-gray-800 bg-opacity-80 border border-gray-700 p-4">
          <DialogHeader>
            <DialogTitle className="text-sm text-white">기타 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <input
              placeholder="제목을 입력하세요"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="text-xs bg-gray-900 text-white bg-opacity-80 px-3 py-2 rounded-md w-full border border-gray-700 outline-none focus:ring-2 focus:ring-gray-600"
            />
            <input
              placeholder="내용을 입력하세요"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="text-xs bg-gray-900 text-white bg-opacity-80 px-3 py-2 rounded-md w-full border border-gray-700 outline-none focus:ring-2 focus:ring-gray-600"
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handlePostSubmit}>게시물 선택</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
}

export default AddPostModal;
