import { useAuthStore } from "@/stores/authStore";
import { useForm, FormProvider } from "react-hook-form";
import { addLocation } from "@/apis/supabase.ts";
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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/hooks/use-toast";

type LocationFormValues = {
  name: string;
  maxPosters: number;
  type: "상영 예정" | "상영중";
  orderNum: number;
};

function PosterLocation() {
  const { toast } = useToast();
  const methods = useForm<LocationFormValues>({
    defaultValues: {
      name: "",
      maxPosters: 1,
      type: "상영 예정",
      orderNum: 1,
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

    const result = await addLocation(
      user.id,
      data.name,
      data.maxPosters,
      data.type,
      data.orderNum
    );

    if (result.success) {
      reset();
      toast({
        title: "위치 추가 성공!",
        description: "새로운 포스터 위치가 등록되었습니다.",
      });
    } else {
      toast({
        title: "❌ 오류 발생",
        description: "위치 추가에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-md h-fit mx-auto bg-gray-800 text-white border border-gray-200 border-opacity-50">
      <CardContent className="p-6">
        <h2 className="text-lg mb-3">📍 위치 추가</h2>

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
                      <Input
                        className="text-white"
                        placeholder="예: 입구, 로비"
                        {...field}
                      />
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
                    <FormLabel className="text-white">게시 개수</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="상영 예정" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="상영 예정">상영 예정</SelectItem>
                        <SelectItem value="상영중">상영중</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* 정렬 순서 */}
              <FormField
                name="orderNum"
                rules={{ required: "정렬 순서를 입력하세요.", min: 1 }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>정렬 순서</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage>{errors.orderNum?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* 제출 버튼 */}
              <Button
                type="submit"
                className="w-full"
                disabled={!user || isSubmitting}
              >
                {user
                  ? isSubmitting
                    ? "추가 중..."
                    : "위치 추가"
                  : "로그인 필요"}
              </Button>
            </form>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

export default PosterLocation;
