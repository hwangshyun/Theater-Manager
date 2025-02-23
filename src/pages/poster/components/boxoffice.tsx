import { useEffect, useState } from "react";
import { getDailyBoxOffice } from "@/apis/movie";
import { fetchMovies } from "@/apis/tmdb";
import { motion } from "framer-motion";

function BoxOffice() {
  const [boxOfficeList, setBoxOfficeList] = useState<
    {
      movieCd: string;
      movieNm: string;
      audiCnt: number;
      posterUrl?: string | null;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");

    console.log("📌 조회 날짜:", formattedDate);

    getDailyBoxOffice(formattedDate)
      .then(async (data) => {
        console.log("📌 받아온 박스오피스 데이터:", data);

        const moviesWithPosters = await Promise.all(
          data.map(
            async (movie: {
              movieNm: string;
              movieCd: string;
              audiCnt: number;
            }) => {
              const tmdbResults = await fetchMovies(movie.movieNm);
              const posterUrl =
                tmdbResults.length > 0
                  ? `https://image.tmdb.org/t/p/w500${tmdbResults[0].poster_path}`
                  : null;

              return { ...movie, posterUrl };
            }
          )
        );

        setBoxOfficeList(moviesWithPosters);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("박스오피스 데이터를 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative h-[1280px] ">
      <motion.div
        animate={{ y: ["0%", "-100%"] }} // 위에서 아래로 이동
        transition={{ repeat: Infinity, duration: 40, ease: "" }} // 무한 반복
        className="flex flex-col space-y-4 "
      >
        {boxOfficeList.concat(boxOfficeList).map((movie, index) => (
          <div
            key={`${movie.movieCd}-${index}`}
            className="flex flex-col rounded-md border border-gray-600 pb-2" 
          >
            <div className="text-white text-md font-medium">
              {(index % boxOfficeList.length) + 1}위
            </div>
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.movieNm}
                className="w-auto h-40 object-contain rounded-sm"
              />
            ) : (
              <div className="w-auto h-40 object-contain rounded-sm text-white text-xs">
                이미지 없음
              </div>
            )}
            <div className="">
              <div className="text-white text-xs w-28 truncate">
                {movie.movieNm}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default BoxOffice;