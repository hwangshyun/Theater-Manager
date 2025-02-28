import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { FaQuestion } from "react-icons/fa";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const guideSteps = [
  {
    title: "첫 번째!",
    content:
      "영화를 추가하고 포스터를 선택해주세요!\n상영 예정 또는 상영 중인 영화만 게시할 수 있습니다.",
    image: "/step1.png",
  },
  {
    title: "두 번째!",
    content:
      "지점의 포스터 게시 위치를 추가하세요.\n게시 가능 포스터 개수를 설정하고, '상영 중' / '상영 예정' / '기타' 중에서 선택해주세요.",
    image: "/step1.png",
  },
  {
    title: "세 번째",
    content:
      "게시할 포스터를 선택한 후, 해당 위치의 포스터 슬롯을 클릭하면 자동으로 배치됩니다.\n이때 최대 개수를 초과할 수 없습니다.",
    image: "/step1.png",
  },
  {
    title: "네 번째!",
    content:
      "포스터가 아닌 기타 게시물을 게시하고 싶다면 좌측 첫 번째 아이콘을 클릭하세요!\n제목과 이미지를 추가한 후 '선택'을 눌러 배치할 수 있습니다.\n(이미지와 내용은 선택사항입니다.)",
    image: "/step1.png",
  },
  {
    title: "🎉 마지막!",
    content:
      "이제 포스터 배치를 자유롭게 해보세요!\n편안한 포스터 배치 되세요!\n  ",
    image: "/step1.png",
  },
];

function GuideModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button className="bg-gray-900 bg-opacity-80 border border-gray-600 rounded-sm hover:bg-gray-800 hover:bg-opacity-80 hover:border-gray-500">
      <FaQuestion className="text-gray-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[800px]  bg-gray-900 bg-opacity-80  border border-gray-700 p-6 rounded-md">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-left-bottom opacity-20 "
          style={{
            backgroundImage: "url('/guide.png')", // ✅ 배경 이미지 추가
            backgroundSize: "500px auto", // ✅ 크기 조정
          }}
        />
        <DialogHeader>
          <DialogTitle className="text-lg text-white text-center"></DialogTitle>
        </DialogHeader>
        <Carousel className="w-full">
          <CarouselContent className="w-full">
            {guideSteps.map((step, index) => (
              <CarouselItem key={index} className="p-4">
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-white whitespace-pre-line  text-lg ">
                    {step.content}
                  </p>
                  {/* ✅ 이미지 추가 */}
                  {step.image && (
                    <img src={step.image} alt={step.title} className="h-60" />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-6  h-full  rounded-none rounded-r-full border-none  text-gray-400 bg-transparent bg-opacity-80 hover:bg-white hover:bg-opacity-20 hover:text-white" />
          <CarouselNext className="-right-6  h-full rounded-none rounded-l-full border-none  text-gray-400 bg-transparent bg-opacity-80 hover:bg-white hover:bg-opacity-20 hover:text-white" />
        </Carousel>
        <div className="flex justify-center ">
          <DialogClose asChild></DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GuideModal;
