import { createClient } from "@supabase/supabase-js";

// Supabase 클라이언트 설정
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

/**
 * 🎯 새로운 포스터 배치 위치 추가
 * @param userId - 사용자 ID (영화관을 구분)
 * @param name - 위치 이름 (예: "입구", "로비")
 * @param maxPosters - 해당 위치에 배치 가능한 최대 포스터 개수
 * @param type - 위치 유형 (예: "실내", "실외")
 * @param orderNum - 정렬 순서
 */
export async function addLocation(
  userId: string,
  name: string,
  maxPosters: number,
  type: string,
  orderNum: number
) {
  // 1️⃣ locations 테이블에 새로운 위치 추가
  const { data: location, error } = await supabase
    .from("locations")
    .insert([
      {
        user_id: userId,
        name,
        max_posters: maxPosters,
        type,
        order_num: orderNum,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("❌ 위치 추가 실패:", error);
    return { success: false, message: "위치 추가 실패" };
  }

  console.log("✅ 위치 추가 성공:", location);

  // 2️⃣ max_posters 개수만큼 posterlocations 테이블에 슬롯 추가
  const posterSlots = Array.from({ length: maxPosters }, (_, i) => ({
    user_id: userId,
    location: location.id, // 위치 이름
    order_num: i + 1, // 1부터 시작
    type: location.type, // "상영 예정" 또는 "상영중"
    title: null, // 초기값 null
    poster_url: null, // 초기값 null
    location_name: location.name, // 위치 이름
  }));

  const { error: posterError } = await supabase
    .from("posterlocations")
    .insert(posterSlots);

  if (posterError) {
    console.error("❌ 포스터 슬롯 추가 실패:", posterError);
    return { success: false, message: "포스터 슬롯 추가 실패" };
  }

  console.log("✅ 포스터 슬롯 추가 성공", posterSlots);

  return { success: true, message: "위치 및 포스터 슬롯 추가 성공" };
}
export async function getLocations(userId: string) {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("user_id", userId)
      .order("order_num", { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("❌ 위치 목록 불러오기 실패:", error);
    return { success: false, data: [] };
  }
}

export async function deleteLocation(locationId: string) {
  try {
    const { error } = await supabase
      .from("locations")
      .delete()
      .eq("id", locationId);

    if (error) throw error;
    return { success: true, message: "✅ 위치가 삭제되었습니다!" };
  } catch (error) {
    console.error("❌ 위치 삭제 실패:", error);
    return { success: false, message: "위치를 삭제할 수 없습니다." };
  }
}
export async function getUserPosters(userId: string) {
  try {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .eq("user_id", userId)
      .in("status", ["상영 예정", "상영중"]);

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error("포스터 목록 불러오기 실패:", error);
    return { success: false, data: [] };
  }
}

export async function getPosterLocation(userId: string) {
  try {
    const { data, error } = await supabase
      .from("posterlocations")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("포스터 목록 불러오기 실패:", error);
    return { success: false, data: [] };
  }
}

export async function updatePosterLocation(
  slotId: string,
  title: string,
  posterUrl: string
) {
  try {
    const { error } = await supabase
      .from("posterlocations")
      .update({ title, poster_url: posterUrl })
      .eq("id", slotId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("포스터 슬롯 업데이트 실패:", error);
    return { success: false };
  }
}

export async function deletePosterLocation(slotId: string) {
  try {
    const { error } = await supabase
      .from("posterlocations")
      .update({
        title: null,
        poster_url: null,
      })
      .eq("id", slotId);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("포스터 슬롯 삭제 실패:", error);
    return { success: false };
  }
}

export async function swapLocationOrder(
  userId: string,
  locationId1: string,
  order1: number,
  locationId2: string,
  order2: number
) {
  try {
    const { error: error1 } = await supabase
      .from("locations")
      .update({ order_num: order2 })
      .eq("id", locationId1)
      .eq("user_id", userId);

    const { error: error2 } = await supabase
      .from("locations")
      .update({ order_num: order1 })
      .eq("id", locationId2)
      .eq("user_id", userId);

    if (error1 || error2) throw error1 || error2;

    return { success: true };
  } catch (error) {
    console.error("❌ 위치 순서 변경 실패:", error);
    return { success: false };
  }
}
