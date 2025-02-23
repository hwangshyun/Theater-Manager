// import BoxOffice from "./components/boxoffice";
import BoxOffice from "./components/boxoffice";
import PosterList from "./components/poster-list";
// import Test from "./components/test";
// import MovieRating from "./components/movie-rating";
// import PosterLocation from "./components/poster-location";

function Poster() {
  return (
    <>
  
      <div className="flex w-full  justify-center gap-2">
        {/* <MovieRating /> */}
        {/* <PosterLocation /> */}
        <PosterList />
  <BoxOffice /> 
      </div>
    </>
  );
}

export default Poster;
