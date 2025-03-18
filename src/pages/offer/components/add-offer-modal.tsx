import { useEffect, useState } from "react";
import { uploadImageToSupabase } from "@/apis/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/authStore";
import { AiOutlineExport } from "react-icons/ai";
import { FaUpload } from "react-icons/fa";
import { addOffer, getMovieList } from "@/apis/offer";
import { Tables } from "@/types/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/hooks/use-toast";
import DateRangePicker from "./date";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";

type OfferFormData = {
  selectedMovie: string;
  selectedWeek: string;
  postTitle: string;
  offerPeriod: string;
  method: string;
  customMethod?: string; // 직접입력 선택 시만 존재
};

const MAX_IMAGES = 3;

function AddOfferModal() {
  const userId = useAuthStore((state) => state.user?.id);
  const [movies, setMovies] = useState<Tables<"movies">[]>([]);
  const [postImages, setPostImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm({
    mode: "onChange", // 입력 값 변경 시 유효성 검사 수행
    defaultValues: {
      selectedMovie: "",
      selectedWeek: "",
      postTitle: "",
      offerPeriod: "",
      method: "",
      customMethod: "",
    },
  });

  const selectedMethod = watch("method");

  useEffect(() => {
    if (!userId) return;

    const fetchMovies = async () => {
      try {
        const data = await getMovieList(userId);
        setMovies(data);
      } catch (error) {
        console.error("영화 목록 불러오기 실패", error);
      }
    };

    fetchMovies();
  }, [userId]);

  // 이미지 추가 (파일 선택 & 붙여넣기 통합)
  const handleImageChange = (files: FileList | File[] | null) => {
    if (!files) return;

    const newFiles = Array.from(files).slice(0, MAX_IMAGES - postImages.length); // 최대 3장 제한
    if (!newFiles.length)
      return alert(`최대 ${MAX_IMAGES}장까지만 업로드할 수 있습니다.`);
    toast({
      title: `${newFiles.length}장의 이미지가 추가되었습니다.`,
      description: "특전사항을 추가해주세요.",
    });

    setPostImages((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [
      ...prev,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  // 복사 붙여넣기
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    handleImageChange(
      Array.from(event.clipboardData.items)
        .filter((item) => item.type.startsWith("image/"))
        .map((item) => item.getAsFile() as File)
    );
  };

  // 이미지 삭제
  const handleImageRemove = (index: number) => {
    setPostImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data : OfferFormData) => {
    const {
      selectedMovie,
      selectedWeek,
      postTitle,
      offerPeriod,
      method,
      customMethod,
    } = data;
    const selectedMethod = method === "custom" ? customMethod : method;
    const imageUrlArray = (
      await Promise.all(
        postImages.map((img) => uploadImageToSupabase(img, userId || ""))
      )
    ).filter(Boolean) as string[];

    if (
      await addOffer(
        userId || "",
        selectedMovie,
        selectedWeek,
        offerPeriod,
        postTitle,
        selectedMethod || customMethod || "",
        imageUrlArray
      )
    ) {
      toast({ content: "게시물이 추가되었습니다!" });
      reset();
      setPostImages([]);
      setPreviewUrls([]);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-900 bg-opacity-80 border border-gray-600 rounded-sm hover:bg-gray-800 hover:bg-opacity-80 hover:border-gray-500">
          <AiOutlineExport />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-sm bg-gray-800 bg-opacity-80 border border-gray-700 p-3 rounded-md"
        onPaste={handlePaste} // ✅ 복사 붙여넣기 이벤트 추가
      >
        <DialogHeader>
          <DialogTitle className="text-sm text-white">
            특전사항 추가
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {" "}
          <Controller
            name="selectedMovie"
            control={control}
            rules={{ required: "영화를 선택하세요." }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="text-xs bg-gray-900 text-white px-3 py-2 rounded-md border border-gray-700">
                  <SelectValue placeholder="영화를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {movies.length > 0 ? (
                    movies.map((movie) => (
                      <SelectItem
                        key={movie.id}
                        value={movie.id}
                        className="text-xs"
                      >
                        {movie.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      영화를 추가하세요
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          />
           {/* 📅 제공 주차 */}
           <Controller
            name="selectedWeek"
            control={control}
            rules={{ required: "제공 주차를 선택하세요." }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="text-xs bg-gray-900 text-white px-3 py-2 rounded-md border border-gray-700">
                  <SelectValue placeholder="제공 주차 선택" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(7)].map((_, index) => (
                    <SelectItem key={index} value={`${index + 1}주차`} className="text-xs">
                      {`${index + 1}주차`}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">기타</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          
         {/* 📝 특전사항 */}
         <Controller
            name="postTitle"
            control={control}
            rules={{ required: "특전사항을 입력하세요." }}
            render={({ field }) => (
              <Input {...field} placeholder="특전사항을 입력하세요." className="text-xs bg-gray-900 text-white px-3 py-2 rounded-md border border-gray-700" />
            )}
          />
          
          {/* 📆 제공 기간 */}
          <Controller
            name="offerPeriod"
            control={control}
            rules={{ required: "특전 기간을 선택하세요." }}
            render={({ field }) => <DateRangePicker onChange={field.onChange} />}
          />
         {/* 🏷 제공 방식 */}
         <Controller
        name="method"
        control={control}
        rules={{ required: "제공 방식을 선택하세요." }}
        render={({ field }) => (
          <>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="text-xs bg-gray-900 text-white px-3 py-2 rounded-md w-full border border-gray-700 outline-none focus:ring-2 focus:ring-gray-600">
                <SelectValue placeholder="제공 방식 선택" />
              </SelectTrigger>
              <SelectContent className="text-xs bg-gray-900 text-white border border-gray-700">
                <SelectItem value="전산처리" className="text-xs">전산처리</SelectItem>
                <SelectItem value="현장제공" className="text-xs">현장제공</SelectItem>
                <SelectItem value="custom" className="text-xs">직접입력</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      />

      {/* ✅ 직접입력 선택 시 입력 필드 활성화 */}
      {selectedMethod === "custom" && (
        <Controller
          name="customMethod"
          control={control}
          rules={{ required: "제공 방식을 입력하세요." }}
          render={({ field }) => (
            <>
              <Input
                {...field}
                placeholder="제공 방식을 입력하세요"
                className="text-xs bg-gray-900 text-white px-3 py-2 rounded-md w-full border border-gray-700 outline-none focus:ring-2 focus:ring-gray-600"
              />
            </>
          )}
        />
      )}
          
          {/* 파일 업로드 UI */}
          <label
            htmlFor="fileUpload"
            className="flex items-center justify-between bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-2 rounded-md cursor-pointer border border-gray-600"
          >
            <div className="flex flex-col items-center">
              <p>{postImages.map((image) => image.name).join(", ")}</p>
              {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {previewUrls.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`미리보기-${index}`}
                      className="w-20 h-20 object-cover rounded-md border border-gray-600 cursor-pointer"
                      onClick={() => handleImageRemove(index)}
                      title="이미지를 클릭하면 삭제됩니다"
                    />
                  ))}
                </div>
              )}
            </div>
            <FaUpload className="text-white" />
          </label>
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleImageChange(e.target.files)}
          />
          <p className="text-xs text-gray-400 text-center">
            {postImages.length} / {MAX_IMAGES} 장 업로드됨
          </p>
          <div className="flex justify-end gap-2 mt-3">
            <DialogClose asChild>
              <Button  className="bg-gray-700 p-2 border border-gray-600 rounded-sm hover:bg-gray-600 hover:border-gray-500" onClick={() => reset()}>
                취소
              </Button>
            </DialogClose>
            <DialogClose asChild>
            <Button type="submit" disabled={!isValid} className="bg-blue-600 p-2 border border-blue-500 rounded-sm hover:bg-blue-500">
            게시하기
          </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddOfferModal;
