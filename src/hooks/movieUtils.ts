// utils/movieUtils.ts
import { supabase } from "@/utils/supabaseClient";

export async function updateMovieStatus(id: string, newStatus: string) {
  const { error } = await supabase
    .from("movies")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    console.error("Error updating status:", error);
    return false;
  }

  return true;
}

export async function deleteMovie(id: string) {
  const { error } = await supabase.from("movies").delete().eq("id", id);

  if (error) {
    console.error("Error deleting movie:", error);
    return false;
  }

  return true;
}

export async function getMoviesStatus() {
  const { data, error } = await supabase
    .from("movies")
    .select("*");

  if (error) {
    console.error("Error fetching movies status:", error);
    return [];
  }

  return data; 
}