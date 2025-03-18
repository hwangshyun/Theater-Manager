import { Tables } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

// Supabase 클라이언트 설정
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export type Offer = Tables<"offers">;

export async function getOffers(userId: string): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("🚨 offers 데이터 불러오기 실패:", error);
    throw error;
  }

  return data;
}

export async function addOffer(
  userId: string,
  movieId: string,
  week: string,
  period: string,
  content: string,
  methods: string,
  imageUrls: string[]
): Promise<boolean> {
  const { error } = await supabase.from("offers").insert([
    {
      movieId,
      week,
      period,
      content,
      methods,
      user_id: userId,
      image_url: imageUrls, // ✅ 이미지 URL 배열 저장
    },
  ]);

  if (error) {
    console.error("🚨 offers 테이블에 데이터 저장 실패:", error);
    return false;
  }

  console.log("✅ offers 테이블에 데이터 추가 완료!");
  return true;
}

export async function deleteOffer(offerId: string): Promise<boolean> {
  const { error } = await supabase.from("offers").delete().eq("id", offerId);

  if (error) {
    console.error("🚨 offers 데이터 삭제 실패:", error);
    return false;
  }

  console.log("✅ offer 삭제 완료");
  return true;
}

export async function getMovieList(userId: string): Promise<Tables<"movies">[]> {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("🚨 movies 데이터 불러오기 실패:", error);
    throw error;
  }

  return data;
}