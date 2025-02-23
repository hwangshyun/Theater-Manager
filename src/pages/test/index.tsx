import { fetchMoviePosters, searchMoviesWithKobis } from "@/apis/tmdb";
import { useState } from "react";
export interface MovieTmbd {
    id: number;
    title: string;
    poster_path: string | null; // 포스터가 없는 경우도 있음
    backdrop_path: string | null; // 배경이미지가 없는 경우도 있음
    release_date: string;
  }


function Test() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<MovieTmbd[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [posters, setPosters] = useState<string[]>([]); // 여러 개의 포스터 저장

  const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const handleSearch = async () => {
    if (!query.trim()) return;

    const results = await searchMoviesWithKobis(query);
    setMovies(results);
  };
  console.log(movies)
  const handleShowPosters = async (movieId: number) => {
    setSelectedMovieId(movieId);
    const posterUrls = await fetchMoviePosters(movieId);
    setPosters(posterUrls);
    console.log(posterUrls)
  };
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🎬 TMDb 영화 검색</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="영화 제목 입력..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
          검색
        </button>
      </div>

      {/* 검색된 영화 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div key={movie.id} className="border rounded-lg p-2 shadow-md">
            {movie.poster_path ? (
                <div>
              <img
                src={`${IMAGE_BASE_URL}w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto rounded-md cursor-pointer"
                onClick={() => handleShowPosters(movie.id)} // 클릭하면 모든 포스터 불러오기
              />
              <img src={`${IMAGE_BASE_URL}w500${movie.backdrop_path}`} alt="" /></div>
            ) : (
              <div className="h-60 flex items-center justify-center bg-gray-200 rounded-md">
                포스터 없음
              </div>
            )}
            <h3 className="mt-2 text-sm font-semibold">{movie.title}</h3>
            <h3 className="mt-2 text-sm font-semibold">{movie.release_date}</h3>
          </div>
        ))}
      </div>

      {/* 선택된 영화의 모든 포스터 표시 */}
      {selectedMovieId && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">📸 추가 포스터</h3>
          <div className="flex gap-2 overflow-x-auto">
            {posters.length > 0 ? (
              posters.map((posterUrl, index) => (
                <img key={index} src={posterUrl} alt="포스터" className="h-40 rounded-md" />
              ))
            ) : (
              <p className="text-gray-500">추가 포스터가 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Test;