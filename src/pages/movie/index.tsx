import { useAuthStore } from "@/stores/authStore";
import { useFetchMovies } from "@/hooks/useFetchMovies";
import { updateMovieStatus, deleteMovie } from "@/hooks/movieUtils";
import MovieList from "./components/movie-list";
import MovieAdd from "./components/movie-add";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useToast } from "@/components/hooks/use-toast";
import { useState } from "react";
import { Tables } from "@/types/supabase";
import Spinner from "@/components/ui/spinner";

type MovieType = Tables<"movies">;

function Movie() {
  const user = useAuthStore((state) => state.user);
  const { movies, setMovies, loading } = useFetchMovies(user?.id);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleUpdateMovieStatus = async (id: string, newStatus: string) => {
    const success = await updateMovieStatus(id, newStatus);
    if (success) {
      setMovies((prev) =>
        prev.map((movie) =>
          movie.id === id ? { ...movie, status: newStatus } : movie
        )
      );
      toast({
        title: "상태 업데이트 완료",
        description: "영화 상태가 변경되었습니다.",
      });
    }
  };

  const handleDeleteMovie = async (id: string) => {
    const success = await deleteMovie(id);
    if (success) {
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
      toast({
        title: "삭제 완료",
        description: "영화가 성공적으로 삭제되었습니다.",
      });
    }
  };

  const handleAddMovie = (newMovie: MovieType) => {
    setMovies((prev) => [...prev, newMovie]);
    setOpen(false);
  };

  return (
    <div className="px-20">
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="border border-gray-500 text-white hover:bg-gray-700 hover:text-white ml-4 mt-4"
            >
              영화 추가하기
            </Button>
          </DialogTrigger>
          <DialogDescription />
          <DialogTitle />
          <DialogContent className=" text-white border border-gray-700 shadow-lg bg-opacity-40 bg-gray-900 p-4">
            <MovieAdd onAdd={handleAddMovie} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <MovieList
          movies={movies}
          updateMovieStatus={handleUpdateMovieStatus}
          deleteMovie={handleDeleteMovie}
        />
      )}
    </div>
  );
}

export default Movie;
