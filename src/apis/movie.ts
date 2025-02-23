import axios from "axios";

// 환경 변수 로드
const KOB_API_KEY = import.meta.env.VITE_KOB_API_KEY; // 영진위 API 키
const KOB_BASE_URL = import.meta.env.VITE_KOB_BASE_URL; // 영진위 API 베이스 URL

/**
 * 영화 정보를 검색하는 함수
 * @param movieNm 영화 이름 (검색 키워드)
 * @param itemPerPage 한 페이지에 가져올 영화 개수 (기본값: 50)
 * @returns 검색 결과 데이터
 */
export async function SearchMovies(movieNm: string, itemPerPage: number = 100, currentPage?: number) {
  try {
    const response = await axios.get(
      `${KOB_BASE_URL}/movie/searchMovieList.json`,
      {
        params: {
          key: KOB_API_KEY,
          movieNm,
          itemPerPage,
          currentPage
        },
      }
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Failed to fetch movie data:", error);
    throw error;
  }
}

/**
 * 특정 영화의 상세 정보를 가져오는 함수
 * @param movieCd 영화 코드 (고유 식별자)
 * @returns 영화 상세 정보
 */
export async function getMovieInfo(movieCd: string) {
  try {
    const response = await axios.get(
      `${KOB_BASE_URL}/movie/searchMovieInfo.json`,
      {
        params: {
          key: KOB_API_KEY,
          movieCd,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch movie info:", error);
    throw error;
  }
}

export async function getDailyBoxOffice(targetDt: string, itemPerPage: number = 20) {
  try {
    const response = await axios.get(
      `${KOB_BASE_URL}/boxoffice/searchDailyBoxOfficeList.json`,
      {
        params: {
          key: KOB_API_KEY,
          targetDt, // 조회 날짜 (YYYYMMDD)
          itemPerPage, // 가져올 영화 개수
        },
      }
    );
    console.log("📌 API 응답 데이터:", response.data); // 응답 데이터 확인
    return response.data.boxOfficeResult.dailyBoxOfficeList;
  } catch (error) {
    console.error("Failed to fetch daily box office data:", error);
    throw error;
  }
}
