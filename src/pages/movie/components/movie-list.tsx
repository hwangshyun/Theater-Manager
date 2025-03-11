import { Tables } from "@/types/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type MovieType = Tables<"movies">;
type MovieStatus = "상영 예정" | "상영중" | "종영";

interface MovieListProps {
  movies: MovieType[];
  updateMovieStatus: (id: string, newStatus: MovieStatus) => void;
  deleteMovie: (id: string) => void;
}

function renderButtons(
  id: string,
  status: MovieStatus,
  updateMovieStatus: (id: string, newStatus: MovieStatus) => void,
  deleteMovie: (id: string) => void
) {
  const actions: Record<
    MovieStatus,
    { label: string; variant: string; newStatus: string }[]
  > = {
    "상영 예정": [
      { label: "상영중", variant: "ghost", newStatus: "상영중" },
      { label: "종영", variant: "ghost", newStatus: "종영" },
    ],
    상영중: [
      { label: "상영 예정", variant: "ghost", newStatus: "상영 예정" },
      { label: "종영", variant: "ghost", newStatus: "종영" },
    ],
    종영: [
      { label: "상영중", variant: "ghost", newStatus: "상영중" },
      { label: "삭제", variant: "destructive", newStatus: "삭제" },
    ],
  };

  return actions[status].map(({ label, variant, newStatus }) => (
    <Button
      key={label}
      size="sm"
      variant={variant as "ghost" | "destructive"}
      className="hover:bg-gray-700 hover:text-white py-1 px-2 rounded-sm"
      onClick={() =>
        newStatus === "삭제"
          ? deleteMovie(id)
          : updateMovieStatus(id, newStatus as MovieStatus)
      }
    >
      {label}
    </Button>
  ));
}

// MovieList 컴포넌트 선언
function MovieList({ movies, updateMovieStatus, deleteMovie }: MovieListProps) {
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
    {
      title: "종영",
      data: movies.filter((movie) => movie.status === "종영"),
      borderColor: "border-b-4 border-red-600 border-opacity-50",
    },
  ];

  function openNaverSearch(title: string) {
    const query = encodeURIComponent(title);
    const url = `https://search.naver.com/search.naver?query=${query}`;
    window.open(url, "_blank");
  }

  return (
    <div className="flex justify-around p-4 gap-3 h-full mb-8">
      {statusMovies.map((status) => {
        const totalCount = status.data.reduce(
          (sum, movie) => sum + (parseInt(movie.count || "0", 10) || 0),
          0
        );

        return (
          <div key={status.title} className="w-1/3 ">
            <div className="rounded-md border border-gray-500 border-opacity-50 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      colSpan={3}
                      className={`text-center text-xl font-light p-2 text-white ${status.borderColor} pointer-events-none select-none`}
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
                        className=" hover:bg-gray-600 border-b border-gray-500 border-opacity-50"
                      >
                        <TableCell className="text-left text-white w-3/4">
                          <p
                            className="font-medium text-sm cursor-pointer  hover:font-bold inline-block duration-50"
                            onClick={() => openNaverSearch(movie.title)}
                          >
                            {movie.title}
                          </p>
                          <p className="text-xs">{movie.date || "N/A"}</p>
                          <p className="text-xs">{movie.count || "0"} 장</p>
                        </TableCell>
                        <TableCell className="text-right text-white w-1/12">
                          <img
                            src={
                              movie.posterurl ||
                              "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                            }
                            alt={movie.title}
                            className="min-w-10 min-h-16 object-cover cursor-pointer"
                            onClick={() => {
                              window.open(
                                movie.posterurl ||
                                  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
                                "_blank"
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-right text-white w-1/12">
                          <div className="flex flex-col  select-none">
                            {renderButtons(
                              movie.id,
                              movie.status as MovieStatus,
                              updateMovieStatus,
                              deleteMovie
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="text-center text-gray-500 p-4"
                      >
                        영화가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}

                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-right font-normal text-white p-2  pointer-events-none"
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
  );
}

export default MovieList;
