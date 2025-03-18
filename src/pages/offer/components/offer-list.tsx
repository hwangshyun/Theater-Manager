import { deleteOffer, getMovieList, getOffers, Offer } from "@/apis/offer";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { Tables } from "@/types/supabase";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

type Movie = Tables<"movies">;

function OfferList() {
  const userId = useAuthStore((state) => state.user?.id);
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [groupedOffers, setGroupedOffers] = useState<{ [movieId: string]: Offer[] }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    const fetchOffers = async () => {
      try {
        const data = await getOffers(userId);
        setOffers(data);
      } catch (error) {
        console.error("🚨 offers 데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchMovies = async () => {
      try {
        const data = await getMovieList(userId);
        setMovies(data);
      } catch (error) {
        console.error("🚨 movies 데이터 불러오기 실패:", error);
      }
    };

    fetchOffers();
    fetchMovies();
  }, [userId]);

  useEffect(() => {
    if (offers) {
      const grouped = offers.reduce<{ [movieId: string]: Offer[] }>((acc, offer) => {
        if (!acc[offer.movieId]) {
          acc[offer.movieId] = [];
        }
        acc[offer.movieId].push(offer);
        return acc;
      }, {});
      setGroupedOffers(grouped);
    }
  }, [offers]);

  const handleDeleteOffer = async (offerId: string) => {
    try {
      await deleteOffer(offerId);
      setOffers((prevOffers) => prevOffers ? prevOffers.filter((offer) => offer.id !== offerId) : null);
    } catch (error) {
      console.error("🚨 게시물 삭제 실패:", error);
    }
  };

  return (
    <div className="">

      {loading ? (
        <p className="text-gray-400">로딩 중...</p>
      ) : offers && offers.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(groupedOffers).map(([movieId, movieOffers]) => {
            const movieTitle = movies?.find((movie) => movie.id === movieId)?.title || "알 수 없는 영화";

            return (
              <div key={movieId} className="p-4 bg-gray-700 rounded-md">
                <h3 className="text-lg font-semibold text-white mb-3">{movieTitle}</h3>
                <div className="flex gap-2">
                  {movieOffers.map((offer) => (
                    <div key={offer.id} className="p-2 bg-gray-600 rounded-md">
                      <div className="flex gap-1">
                        {Array.isArray(offer.image_url) &&
                          offer.image_url.map((image, index) => (
                            <img
                              key={index}
                              src={image as string}
                              alt={`offer-${index}`}
                              className="w-24 h-24 object-cover rounded-md"
                            />
                          ))}
                      </div>
                      <p className="text-white text-xs">{offer.content}</p>
                      <p className="text-white text-xs">{offer.methods || "제공 방식 없음" }</p>
                      <p className="text-white text-xs">{offer.period}</p>
                      <p className="text-white  text-xs">{offer.week}</p>
                      <Button className="bg-red-600 hover:bg-red-700 mt-2" onClick={() => handleDeleteOffer(offer.id)}>
                        <AiOutlineDelete className="text-white" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400">게시물이 없습니다.</p>
      )}
    </div>
  );
}

export default OfferList;