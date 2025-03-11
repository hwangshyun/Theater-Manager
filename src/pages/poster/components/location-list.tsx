import { Card, CardContent } from "@/components/ui/card";
import { FaRegCircle } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { Movie, PosterSlot } from "./poster.page";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import LocationSkeleton from "./location-skeleton";
import { useEffect, useState } from "react";
import { getMoviesStatus } from "@/hooks/movieUtils";
import { IoIosMore } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LocationListProps {
  title: string;
  type: "상영중" | "상영 예정" | "기타";
  groupedPosters: Record<string, PosterSlot[]>;
  selectedLocation: string | null;
  handleMoveLocation: (locationId: string) => void;
  handleDeleteLocation: (locationId: string) => void;
  assignPosterToSlot: (slotId: string) => void;
  selectedMovie: Movie | null;
  isLoading: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void; // ⬅️ onClick 추가
}

function LocationList({
  title,
  type,
  groupedPosters,
  selectedLocation,
  handleMoveLocation,
  handleDeleteLocation,
  assignPosterToSlot,
  selectedMovie,
  isLoading,
  onClick,
}: LocationListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  useEffect(() => {
    async function fetchMovies() {
      const moviesData = await getMoviesStatus();
      setMovies(moviesData);
    }

    fetchMovies();
  }, []);

  return (
    <Accordion
      type="multiple"
      className="border-none flex flex-col px-2 pr-8 mb-2"
      defaultValue={[title]}
    >
      <AccordionItem className="m-0 border-b border-gray-600" value={title}>
        <AccordionTrigger className="p-0 pb-2 text-xl text-white">
          {title}
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-2">
            {isLoading
              ? Array.from({ length: 5 }).map(
                  (
                    _,
                    index // 로딩 중일 때 스켈레톤 5개 표시
                  ) => (
                    <Card
                      key={index}
                      className="px-2 pb-1 bg-gray-800 border-gray-700 bg-opacity-30 text-white rounded-sm flex flex-col h-full max-h-48"
                    >
                      <p className="flex items-center justify-between text-lg text-center mt-1">
                        <div className="w-24 h-5 bg-gray-700 rounded animate-pulse"></div>
                        <div className="flex items-center gap-1 no-print">
                          <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse"></div>
                          <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      </p>
                      <CardContent
                        className="grid gap-2 grid-cols-3"
                      >
                        {Array.from({ length: 3 }).map((_, i) => (
                          <LocationSkeleton key={i} />
                        ))}
                      </CardContent>
                    </Card>
                  )
                )
              : Object.entries(groupedPosters)
                  .filter(([, posters]) => posters[0].type === type)
                  .map(([locationId, posters]) => (
                    <Card
                      key={locationId}
                      className={`px-1 pb-1 bg-gray-800 border-gray-700 bg-opacity-30 text-white rounded-sm flex flex-col h-full max-h-48
                  ${selectedLocation === locationId ? " border-green-800" : ""}
                  
                `}
                      onClick={onClick}
                    >
                      <p className="flex items-center justify-between text-sm mb-1 text-center mt-1">
                        {posters[0].location_name}

                        <div className="flex items-center gap-1 no-print">
                          {/* 📌 DropdownMenu 추가 */}
                          <DropdownMenu>
                            <DropdownMenuTrigger className="focus:outline-none">
                              <IoIosMore className="text-gray-400 cursor-pointer w-5 h-5 hover:text-white" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="bg-gray-800 border border-gray-700 rounded-md p-1"
                            >
                              <DropdownMenuItem
                                onClick={() => handleMoveLocation(locationId)}
                                className="flex items-center gap-2 text-white cursor-pointer px-2 py-1 hover:bg-gray-700"
                              >
                                <FaRegCircle className="border-2 border-gray-700 text-gray-400 rounded-full size-3" />
                                위치 이동
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleDeleteLocation(locationId)}
                                className="flex items-center gap-2 text-red-500 cursor-pointer px-2 py-1 hover:bg-gray-700"
                              >
                                <MdDeleteOutline className="w-4 h-4" />
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </p>

                      <CardContent
                        className={`grid gap-2`}
                        style={{
                          gridTemplateColumns: `repeat(${Math.min(
                            posters.length
                          )}, minmax(80px, 1fr))`,
                        }}
                      >
                        {posters.map((slot) => {
                          const matchedMovie = movies.find(
                            (movie) =>
                              movie.title === slot.title &&
                              movie.user_id === slot.user_id
                          );

                          const isEnded = matchedMovie?.status === "종영";

                          return (
                            <div
                              key={slot.id}
                              onClick={() => assignPosterToSlot(slot.id)}
                              className={` pb-1 h-full w-full flex flex-col items-center justify-center bg-gray-700 bg-opacity-30 border border-gray-700 rounded-sm cursor-pointer hover:bg-gray-700
        ${isEnded ? " border-red-800" : ""}
      `}
                            >
                              {slot.poster_url ? (
                                <div className="h-full max-h-28 flex items-center justify-center">
                                  <img
                                    src={slot.poster_url}
                                    alt={slot.title || "포스터"}
                                    className="max-w-20 max-h-28 rounded-tsm"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-full max-h-28 bg-gray-600 flex items-center justify-center text-xs rounded-t-sm">
                                  {selectedMovie ? "클릭하여 추가" : "없음"}
                                </div>
                              )}
                              <p className="max-w-20 px-2 mt-1 text-xs truncate text-center">
                                {slot.title || `슬롯 ${slot.order_num}`}
                              </p>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default LocationList;
