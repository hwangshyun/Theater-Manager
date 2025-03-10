import { Tables } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

// Supabase 클라이언트 설정
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

type Offer = Tables<"offers">;

export async function getOffers(userId: string) {
  const { data, error } = await supabase.from("offers").select("*").eq("user_id", userId);
  if (error) {
    throw error;
  }
  return data;
}

export async function addOffer(offer: Offer) {
  const { data, error } = await supabase.from("offers").insert(offer);
  if (error) {
    throw error;
  }
  return data;
}


export async function deleteOffer(offerId: string) {
  const { data, error } = await supabase.from("offers").delete().eq("id", offerId);
  if (error) {
    throw error;
  }
  return data;
}

export async function getMovieList(userId: string) {
  const { data, error } = await supabase.from("movies").select("*").eq("user_id", userId);
  if (error) {
    throw error;
  }
  return data;
}