import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchMovies } from "@/hooks/useFetchMovies";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/utils/supabaseClient";
import { FaStar, FaRegStar } from "react-icons/fa";
function MovieRating() {
  const user = useAuthStore((state) => state.user);
  const { movies, setMovies, loading } = useFetchMovies(user?.id, [
    "상영 예정",
    "상영중",
  ]);

  const statusMovies = [
    {
      title: "상영 예정",
      data: movies.filter((movie) => movie.status === "상영 예정"),
      borderColor: "border-b-4 border-yellow-600 border-opacity-50",
    },
    {
      title: "상영중",
      data: movies.filter((movie) => movie.status === "상영중"),
      borderColor: "border-b-4 border-green-600 border-opacity-50",
    },
  ];

  // 영화 레이팅 업데이트 함수
  const updateRating = async (id: string, rating: number) => {
    const { error } = await supabase
      .from("movies")
      .update({ rating })
      .eq("id", id);

    if (error) {
      console.error("Error updating rating:", error);
    } else {
      setMovies((prev) =>
        prev.map((movie) => (movie.id === id ? { ...movie, rating } : movie))
      );
    }
  };

  // 별(★) 렌더링 함수
  const renderRatingStars = (id: string, rating: number | null) => {
    const currentRating = rating || 0;

    return (
      <div className="flex gap-0">
        {[...Array(5)].map((_, i) =>
          i + 1 <= currentRating ? (
            <FaStar
              key={i}
              className="text-yellow-400 cursor-pointer"
              onClick={() => updateRating(id, i + 1)}
            />
          ) : (
            <FaRegStar
              key={i}
              className="text-gray-400 cursor-pointer"
              onClick={() => updateRating(id, i + 1)}
            />
          )
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="text-white text-center">로딩 중...</div>;
  }

  if (!movies.length) {
    return (
      <div className="text-white text-center">표시할 영화가 없습니다.</div>
    );
  }

  return (
    <div className="min-h-screen w-1/2">
      <div className="flex justify-start p-4 gap-2">
        {statusMovies.map((status) => {
          const totalCount = status.data.reduce(
            (sum, movie) => sum + (parseInt(movie.count || "0", 10) || 0),
            0
          );

          return (
            <div key={status.title} className="w-1/2">
              <div className="rounded-md border border-gray-200 border-opacity-50 shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        colSpan={4}
                        className={`text-center text-xl font-light p-2 text-white ${status.borderColor}`}
                      >
                        {status.title}
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {status.data.length > 0 ? (
                      status.data.map((movie) => (
                        <TableRow
                          key={movie.id}
                          className="hover:bg-gray-800 border-b border-gray-200 border-opacity-50"
                        >
                          <TableCell className="text-white text-left w-1/2">
                            <p className="font-medium text-base cursor-pointer hover:font-bold">
                              {movie.title}
                            </p>
                            <p>{movie.date || "N/A"}</p>
                          </TableCell>
                          <TableCell className="text-white text-right w-1/4">
                            {movie.count || "0"} 장
                          </TableCell>
                          <TableCell className=" w-1/12">
                          <img
                            src={movie.posterurl || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                            alt={movie.title}
                            className="min-w-10 max-h-16 object-cover cursor-pointer"
                            onClick={() => {
                              window.open(movie.posterurl || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", "_blank");
                            }}
                          />
                          </TableCell>
                          <TableCell className="text-white text-center w-1/4">
                            {renderRatingStars(movie.id, movie.rating)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500 p-4"
                        >
                          영화가 없습니다.
                        </TableCell>
                      </TableRow>
                    )}

                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-right font-normal text-white p-2 border-t border-gray-300 border-opacity-50"
                      >
                        총 {totalCount} 장
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MovieRating;
