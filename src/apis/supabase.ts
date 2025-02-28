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

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("❌ 위치 목록 불러오기 실패:", error);
    return { success: false, data: [] };
  }
}

export async function deleteLocation(locationId: string) {
  try {
    // 1️⃣ 먼저 해당 위치에 연결된 모든 posterlocations 삭제
    const { error: posterError } = await supabase
      .from("posterlocations")
      .delete()
      .eq("location", locationId);

    if (posterError) throw posterError;

    console.log("✅ 포스터 슬롯 삭제 완료");

    // 2️⃣ locations 테이블에서 위치 삭제
    const { error } = await supabase
      .from("locations")
      .delete()
      .eq("id", locationId);

    if (error) throw error;

    console.log("✅ 위치 삭제 완료");

    return { success: true, message: "✅ 위치 및 포스터 슬롯이 삭제되었습니다!" };
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

export async function swapLocationOrder(firstId: string, secondId: string): Promise<boolean> {
  try {
    // Step 1: 첫 번째 위치 데이터 가져오기 (전체 컬럼 포함)
    const { data: firstData, error: firstError } = await supabase
      .from("locations")
      .select("*") // 모든 필드를 가져오기 위해 "*" 사용
      .eq("id", firstId)
      .single();

    if (firstError || !firstData) {
      console.error("❌ 첫 번째 위치 데이터를 가져오는 중 오류 발생:", firstError);
      return false;
    }

    // Step 2: 두 번째 위치 데이터 가져오기 (전체 컬럼 포함)
    const { data: secondData, error: secondError } = await supabase
      .from("locations")
      .select("*") // 모든 필드를 가져오기 위해 "*" 사용
      .eq("id", secondId)
      .single();

    if (secondError || !secondData) {
      console.error("❌ 두 번째 위치 데이터를 가져오는 중 오류 발생:", secondError);
      return false;
    }

    // Step 3: order_num 값 교환
    const firstOrderNum = firstData.order_num;
    const secondOrderNum = secondData.order_num;

    // Step 4: 필수 컬럼이 있는지 확인 후 upsert 수행
    const { error: updateError } = await supabase
      .from("locations")
      .upsert([
        { ...firstData, order_num: secondOrderNum }, // 첫 번째 데이터의 order_num을 변경
        { ...secondData, order_num: firstOrderNum }, // 두 번째 데이터의 order_num을 변경
      ]);

    if (updateError) {
      console.error("❌ order_num 변경 실패:", updateError);
      return false;
    }

    console.log(`✅ 위치 변경 성공: ${firstId}(${secondOrderNum}) ↔ ${secondId}(${firstOrderNum})`);
    return true;
  } catch (error) {
    console.error("❌ order_num 변경 중 오류 발생:", error);
    return false;
  }
}