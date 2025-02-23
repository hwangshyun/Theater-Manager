/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Tables } from "@/types/supabase";

type MovieType = Tables<"movies">;

export function useFetchMovies(userId?: string, _status?: string[]) {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setMovies([]);
      setLoading(false);
      return;
    }

    const fetchMovies = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching movies:", error);
      } else {
        setMovies(data || []);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [userId]);

  return { movies, setMovies, loading };
}
