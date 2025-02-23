
import axios from "axios";


const KOB_API_KEY = import.meta.env.VITE_KOB_API_KEY;
const KOB_BASE_URL = import.meta.env.VITE_KOB_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_LANGUAGE = import.meta.env.VITE_TMDB_LANGUAGE || "ko-KR";

/**
 * 🎬 1️⃣ 영진위 API에서 검색어와 유사한 영화 리스트 가져오기
 */
async function getMoviesFromKobis(query: string) {
  try {
    const response = await axios.get(`${KOB_BASE_URL}/movie/searchMovieList.json`, {
      params: {
        key: KOB_API_KEY,
        movieNm: query,
        itemPerPage: 100, // ✅ 10개까지만 가져와서 성능 최적화
      },
    });

    const movies = response.data.movieListResult.movieList;

    return movies.map((movie: { movieNm: string; movieCd: string }) => ({
      title: movie.movieNm,
      movieCd: movie.movieCd, // ✅ 영화 코드 추가 (중복 제거에 활용)
    }));
  } catch (error) {
    console.error("❌ 영진위 API 검색 실패:", error);
    return [];
  }
}

/**
 * 🎬 2️⃣ TMDb에서 병렬로 영화 검색 (중복 제거 + 캐싱)
 */
async function searchMoviesOnTmdb(movies: { title: string; movieCd: string }[]) {
  try {
    const uniqueTitles = new Set(movies.map((movie) => movie.title)); // ✅ 중복 제거

    // ✅ TMDb API 병렬 요청
    const requests = Array.from(uniqueTitles).map((title) =>
      axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          query: title,
          language: TMDB_LANGUAGE,
          include_adult: false,
        },
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      })
    );

    // 🔹 병렬 요청 실행 (속도 개선)
    const responses = await Promise.allSettled(requests);

    // 🔹 성공한 요청만 필터링
    const moviesData = responses
      .filter((res) => res.status === "fulfilled")
      .flatMap((res) => res.value.data.results);

    // 🔹 중복 제거 (영화 ID 기준)
    const uniqueMovies = Array.from(new Map(moviesData.map((m) => [m.id, m])).values());

    return uniqueMovies;
  } catch (error) {
    console.error("❌ TMDb 검색 실패:", error);
    return [];
  }
}

/**
 * 🎬 3️⃣ 최적화된 검색 함수 (영진위 → TMDb)
 */
async function searchMoviesWithKobis(query: string) {
  // 🔹 1. 영진위 API에서 영화 리스트 가져오기
  const movies = await getMoviesFromKobis(query);

  // 🔹 2. TMDb API에서 병렬 검색 실행
  const tmdbMovies = await searchMoviesOnTmdb(movies);

  return tmdbMovies;
}

export { searchMoviesWithKobis };

export const fetchMovies = async (query: string) => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
    const LANGUAGE = import.meta.env.VITE_TMDB_LANGUAGE || "ko-KR";
  
    if (!API_KEY) {
      console.error("❌ TMDb API Key가 설정되지 않았습니다.");
      return [];
    }
  
    try {
      // 🔹 1. 기본 검색 (띄어쓰기 포함)
      const response = await fetch(
        `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=${LANGUAGE}&include_adult=false`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      let results = data.results || [];
  
      // 🔹 2. 띄어쓰기 없는 버전으로 추가 검색
      const noSpaceQuery = query.replace(/\s/g, ""); // 띄어쓰기 제거
      if (noSpaceQuery !== query) {
        const responseNoSpace = await fetch(
          `${BASE_URL}/search/movie?query=${encodeURIComponent(noSpaceQuery)}&language=${LANGUAGE}&include_adult=false`,
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        const dataNoSpace = await responseNoSpace.json();
        const noSpaceResults = dataNoSpace.results || [];
  
        // 🔹 3. 두 개의 결과 합치고 중복 제거 (영화 ID 기준)
        const movieMap = new Map();
        [...results, ...noSpaceResults].forEach((movie) => {
          movieMap.set(movie.id, movie);
        });
        results = Array.from(movieMap.values());
      }
  
      return results;
    } catch (error) {
      console.error("❌ 영화 검색 실패:", error);
      return [];
    }
  };

  export const fetchMoviePosters = async (movieId: number) => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
    const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
  
    if (!API_KEY) {
      console.error("❌ TMDb API Key가 설정되지 않았습니다.");
      return [];
    }
  
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}/images`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      // 포스터 이미지 리스트 반환 (URL 포함)
      return data.posters.map((poster: { file_path: string }) => `${IMAGE_BASE_URL}w500${poster.file_path}`);
    } catch (error) {
      console.error("❌ 영화 포스터 가져오기 실패:", error);
      return [];
    }
  };