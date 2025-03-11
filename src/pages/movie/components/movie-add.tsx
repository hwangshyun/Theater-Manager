import { useEffect, useState } from "react";
// import { SearchMovies } from "@/apis/movie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabaseClient";
import KobMovie from "@/types/movie";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tables } from "@/types/supabase";
import Spinner from "@/components/ui/spinner";
import { fetchMoviePosters, searchMoviesWithKobis } from "@/apis/tmdb";

type MovieType = Tables<"movies">;
function MovieAdd({ onAdd }: { onAdd: (newMovie: MovieType) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<KobMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<KobMovie | null>(null);
  const [count, setCount] = useState("");
  const [movieTitle, setMovieTitle] = useState(selectedMovie?.movieNm || "");
  const [date, setDate] = useState("");
  const itemsPerPage = 10;
  const user = useAuthStore((state) => state.user);
  const { toast } = useToast();
  const [selectedPoster, setSelectedPoster] = useState<string | undefined>(undefined); // ✅ 선택한 대표 포스터

  const [additionalPosters, setAdditionalPosters] = useState<string[]>([]); // ✅ 추가 포스터 상태
  const [loadingPosters, setLoadingPosters] = useState(false); // ✅ 추가 포스터 로딩 상태
  useEffect(() => {
    if (selectedMovie) {
      setSelectedPoster(selectedMovie.posterUrl); // ✅ 기본 대표 포스터 설정
      loadAdditionalPosters(selectedMovie.movieCd);
      setMovieTitle(selectedMovie.movieNm); // 영화 선택 시 초기값 설정

    }
  }, [selectedMovie]);
  const handlePosterSelection = (posterUrl: string) => {
    setSelectedPoster(posterUrl); // ✅ 선택한 포스터를 대표 포스터로 변경
  };


  const loadAdditionalPosters = async (movieCd: string) => {
    setLoadingPosters(true);
    try {
      const posters = await fetchMoviePosters(Number(movieCd));
      setAdditionalPosters(posters);
    } catch (error) {
      console.error("Error fetching additional posters:", error);
      toast({
        title: "포스터 로드 실패",
        description: "추가 포스터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoadingPosters(false);
    }
  };
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      // ✅ `searchMoviesWithKobis` 사용하여 TMDb 포스터까지 포함된 결과 가져오기
      const results = await searchMoviesWithKobis(searchTerm);
      
      // ✅ 영진위 데이터와 TMDb 포스터 매핑
      const moviesWithPosters = results.map((movie) => ({
        movieNm: movie.title,
        openDt: movie.release_date || "개봉일 미정",
        release_date: movie.release_date || "개봉일 미정",
        movieCd: movie.id.toString(), // TMDb ID 사용
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : undefined, // ✅ 포스터가 없으면 `undefined`
      }));

      setMovies(moviesWithPosters);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching movies:", error);
      toast({
        title: "검색 실패",
        description: "영화를 검색하는 도중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveMovie = async () => {
    if (!selectedMovie || !user) {
      toast({
        title: "추가 실패",
        description: "영화나 유저 정보가 없습니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("movies")
        .insert({
          title: movieTitle,
          date: date || selectedMovie?.release_date || "개봉일 미정",
          count: count || "0",
          status: "상영 예정",
          user_id: user.id,
          posterurl: selectedPoster,
        })
        .select(); // 삽입된 데이터를 반환

      if (error) throw new Error(error.message);

      if (data && data.length > 0) {
        // 추가 성공 시 onAdd에 전달
        toast({
          title: "추가 완료",
          description: `${selectedMovie.movieNm}이(가) 성공적으로 추가되었습니다.`,
        });
        onAdd(data[0]);
        resetForm();
      }
    } catch (error) {
      console.error("Error adding movie:", error);
      toast({
        title: "추가 실패",
        description: "영화를 추가하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedMovie(null);
    setDate("");
    setCount("");
  };

  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const paginatedMovies = movies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {!selectedMovie && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <h2 className="text-2xl mb-4 mt-2">영화 검색</h2>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="영화 제목 입력"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-transparent hover:bg-gray-700 w-20"
            >
              {loading ? <Spinner /> : "검색"}
            </Button>
          </div>
        </form>
      )}

      {selectedMovie ? (
        <div>
          <div className="flex gap-2 max-h-[400px]">
            <img
               src={selectedPoster || selectedMovie.posterUrl}
               alt={selectedMovie.movieNm}
              className="max-w-2/3 flex-1 h-[400px] mr-auto border border-gray-700 rounded-md "
            />
            <div className="flex-col gap-2 max-w-1/3 max-h-[400px] overflow-y-hidden border-b border-gray-700 rounded-md flex-1">
              {/* ✅ 추가 포스터 로딩 상태 표시 */}
              {loadingPosters && (
                <div className="flex justify-center items-center size-10">
                  <Spinner />
                </div>
              )}

              {/* ✅ 추가 포스터 리스트 */}
              <p className="text-gray-200 ml-1">포스터를 선택하세요</p>
              {additionalPosters.length > 0 ? (
                <div className="flex-col h-[500px] overflow-y-auto border overflow-x-hidden border-gray-700 rounded-md">
                  {additionalPosters.map((posterUrl, index) => (
                    <img
                      key={index}
                      src={posterUrl}
                      alt="추가 포스터"
                      className="w-30 cursor-pointer"
                      onClick={() => handlePosterSelection(posterUrl)}
                    />
                  ))}
                </div>
              ) : (
                !loadingPosters && <p className="text-gray-500">포스터 없음</p>
              )}
            </div>
          </div>
          <Input type="text" value={selectedMovie.movieNm} onChange={(e) => setMovieTitle(e.target.value)} placeholder="{영화 제목 입력}" />
          <div className="flex flex-col gap-3 mt-6">
            <Input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="개봉일 입력"
            />
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="수량 입력"
            />
            <div className="flex gap-2 mt-5">
              <Button
                className="bg-transparent hover:bg-gray-700"
                onClick={saveMovie}
              >
                저장
              </Button>
              <Button variant="ghost" onClick={resetForm}>
                취소
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>영화 제목</TableHead>
                  <TableHead>개봉일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMovies.map((movie) => (
                  <TableRow key={movie.movieCd} className="w-full">
                    <TableCell className="max-w-40">{movie.movieNm}</TableCell>
                    <TableCell>{movie.openDt || "개봉일 미정"}</TableCell>
                    <TableCell>
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.movieNm}
                          className="w-auto h-16"
                        />
                      ) : (
                        <span>포스터 없음</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-transparent hover:bg-gray-700"
                        onClick={() => {
                          setSelectedMovie(movie);
                          setDate(movie.openDt || "");
                          setCount("");
                        }}
                      >
                        선택
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {movies.length > itemsPerPage && (
            <Pagination className="mt-2">
              <PaginationContent>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      className="bg-gray-900 hover:bg-gray-400 cursor-pointer border border-gray-700"
                      isActive={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}

export default MovieAdd;
