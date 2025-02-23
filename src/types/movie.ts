export type MovieStatus = 'nowshowing' | 'comingsoon' | 'end'

export type ActionType = 'show' | 'add' | 'edit' | 'delete'

export default interface KobMovie {
    posterUrl: string | undefined;
    movieCd: string; // 영화 코드
    movieNm: string; // 영화 제목
    openDt: string; // 개봉일
  }
  