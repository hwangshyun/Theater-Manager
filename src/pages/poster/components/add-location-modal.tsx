import { useAuthStore } from "@/stores/authStore";
import { useForm, FormProvider } from "react-hook-form";
import { addLocation } from "@/apis/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/hooks/use-toast";
import { AiOutlinePlus } from "react-icons/ai";

type LocationFormValues = {
  name: string;
  maxPosters: number;
  type: "상영 예정" | "상영중" | "기타";
};

function AddLocationModal() {
  const { toast } = useToast();
  const methods = useForm<LocationFormValues>({
    defaultValues: {
      name: "",
      maxPosters: 1,
      type: "상영 예정",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;
  const user = useAuthStore((state) => state.user);

  const onSubmit = async (data: LocationFormValues) => {
    if (!user) return;

    const result = await addLocation(user.id, data.name, data.maxPosters, data.type);

    if (result.success) {
      reset();
      toast({
        title: `${data.name} 위치 추가 성공`,
        description: "새로운 포스터 위치가 등록되었습니다.",
      });
    } else {
      toast({
        title: "오류 발생",
        description: "위치 추가에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      {/* 버튼을 클릭하면 모달 열림 */}
      <DialogTrigger asChild>
      <Button className="bg-gray-900 bg-opacity-80 border border-gray-600 rounded-sm hover:bg-gray-800 hover:bg-opacity-80 hover:border-gray-500">
      <AiOutlinePlus className="" />
        </Button>
      </DialogTrigger>

      {/* 모달 내용 */}
      <DialogContent className="max-w-sm bg-gray-800 bg-opacity-80 border border-gray-700 p-4">
        <DialogHeader>
          <DialogTitle className="text-sm text-white">📍 위치 추가</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* 위치 이름 */}
              <FormField
                name="name"
                rules={{ required: "위치 이름을 입력하세요." }}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-white">위치 이름</FormLabel>
                    <FormControl>
                      <Input className="text-white" placeholder="예: 입구, 로비" {...field} />
                    </FormControl>
                    <FormMessage>{errors.name?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* 최대 포스터 개수 */}
              <FormField
                name="maxPosters"
                rules={{ required: "포스터 개수를 입력하세요.", min: 1 }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">게시 가능 개수</FormLabel>
                    <FormControl>
                      <Input className="text-white" type="number" {...field} />
                    </FormControl>
                    <FormMessage>{errors.maxPosters?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* 타입 선택 */}
              <FormField
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>타입</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-white">
                          <SelectValue placeholder="상영 예정" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="상영 예정">상영 예정</SelectItem>
                        <SelectItem value="상영중">상영중</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* 버튼 */}
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">취소</Button>
                </DialogClose>
                <Button type="submit" disabled={!user || isSubmitting}>
                  {user ? (isSubmitting ? "추가 중..." : "위치 추가") : "로그인 필요"}
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default AddLocationModal;