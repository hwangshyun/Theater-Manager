import { useState, useEffect } from "react";
import {
  deletePosterLocation,
  getPosterLocation,
  getUserPosters,
  updatePosterLocation,
} from "@/apis/supabase";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/hooks/use-toast";

type PosterSlot = {
  id: string;
  location: string;
  location_name: string;
  order_num: number;
  type: string;
  title: string | null;
  content: string | null;
  poster_url: string | null;
  user_id: string;
};

type Movie = {
  posterurl: string;
  id: string;
  title: string;
  count: number;
  date: string;
  status: string;
  rating: number | null;
  user_id: string;
};

function PosterList() {
  const [groupedPosters, setGroupedPosters] = useState<
    Record<string, PosterSlot[]>
  >({});
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [posterCounts, setPosterCounts] = useState<Record<string, number>>({}); // 🔹 배치된 개수 추적
  const [selectedPost, setSelectedPost] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      fetchPosterSlots();
      fetchMovies();
    }
  }, [user]);

  async function fetchPosterSlots() {
    if (!user) return;
  
    const { success, data } = await getPosterLocation(user.id);
    if (!success || !data?.length) return setGroupedPosters({});
  
    console.log("📌 Supabase에서 가져온 데이터:", data);
  
    // 🔹 1. order_num 기준으로 정렬 (전체 데이터 정렬)
    const sortedData = data.sort((a, b) => a.order_num - b.order_num);
  
    // 🔹 2. location별로 그룹화하여 관리
    const grouped = sortedData.reduce(
      (acc: Record<string, PosterSlot[]>, slot) => {
        (acc[slot.location] ||= []).push(slot);
        return acc;
      },
      {}
    );
  
    setGroupedPosters(grouped);
    updatePosterCounts(grouped);
  
    console.log("📌 정렬된 groupedPosters:", grouped);
  }

  async function fetchMovies() {
    if (!user) return;

    const { success, data } = await getUserPosters(user.id);
    setMovies(success ? data : []);
  }

  // 🔹 현재 포스터가 몇 개 배치되었는지 계산
  function updatePosterCounts(grouped: Record<string, PosterSlot[]>) {
    const counts: Record<string, number> = {};

    Object.values(grouped)
      .flat()
      .forEach((slot) => {
        if (slot.poster_url) {
          counts[slot.title!] = (counts[slot.title!] || 0) + 1;
        }
      });

    setPosterCounts(counts);
  }
  async function deletePosterFromSlot(slotId: string) {
    if (!user) return;

    const {success} = await deletePosterLocation(slotId);
    if (success) fetchPosterSlots();
  }

  async function assignPosterToSlot(slotId: string) {
    if (!user) return;

    if (selectedMovie) {
      // 선택된 영화가 있는 경우 포스터 추가
      const movieTitle = selectedMovie.title;
      const maxCount = selectedMovie.count;
      const currentCount = posterCounts[movieTitle] || 0;
  
      if (currentCount >= maxCount) {
        toast({
          title: `${movieTitle}는 최대 ${maxCount}개까지만 배치할 수 있습니다.`,
        });
        return;
      }
  
      const { success } = await updatePosterLocation(
        slotId,
        selectedMovie.title,
        selectedMovie.posterurl
      );
      if (success) fetchPosterSlots();
    } else if (selectedPost) {
      // 기타 게시물이 선택된 경우 추가
      const { success } = await updatePosterLocation(
        slotId,
        selectedPost.title,
        selectedPost.content
      );
      if (success) fetchPosterSlots();
    } else {
      // 선택된 영화나 게시물이 없는 경우 포스터 삭제
      await deletePosterFromSlot(slotId);
    }
  }
  


  return (
    <div className="max-h-[400px]">
      {/* 🎬 현재 보유한 영화 목록 (선택 가능) */}

      <div className="flex  min-w-2/3 border border-gray-800 rounded-sm p-2 justify-center mb-3">
        <h3 className="text-lg  text-white  w-20 items-center  flex-col flex border-r border-gray-600 pr-2 mr-4">
          보유목록
          <Button className="bg-gray-900 bg-opacity-80">영화 추가</Button>
        </h3>
        {movies.length === 0 ? (
          <p className="text-gray-400 ite">영화를 추가해주세요.</p>
        ) : (
          <div className="flex gap-2">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className={`flex border border-gray-600 max-w-32 h-44 bg-gray-600 bg-opacity-40 rounded-sm mb-2 cursor-pointer  ${
                  selectedMovie?.id === movie.id
                    ? "border-2 border-white scale-105"
                    : ""
                }`}
              >
                <div>
                  <img
                    src={movie.posterurl || ""}
                    alt={movie.title}
                    className="w-auto max-h-32 object-cover rounded-md"
                  />
                  <p className="max-w-20 truncate text-gray-400 text-sm">
                    {movie.title}
                  </p>
                  <p className="text-xs ">
                    {posterCounts[movie.title] || 0}/{movie.count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className=" border border-gray-600  bg-gray-600 bg-opacity-40 max-h-44 rounded-sm flex flex-col gap-2 items-center p-4 ml-2">
          <h3 className="text-lg mb-2">기타 게시물 추가</h3>

          <input
            placeholder="제목을 입력하세요"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="text-sm bg-gray-900 bg-opacity-80 px-1 rounded-s-sm"
          />
          <input
            placeholder="내용을 입력하세요"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="text-sm bg-gray-900 bg-opacity-80 px-1 rounded-s-sm bg"
          />

          <Button
            className="w-full h-full bg-gray-900 bg-opacity-80 "
            onClick={() => {
              if (!postTitle.trim()) {
                alert("게시물 제목을 입력하세요.");
                return;
              }
              setSelectedPost({ title: postTitle, content: postContent });
              setSelectedMovie(null);
              setPostTitle(""); // 입력 초기화
              setPostContent("");
            }}
          >
            게시물 선택
          </Button>
        </div>
      </div>

      {/* 🎭 포스터 슬롯 */}
      <div className="flex gap-2">
        {/* 🎬 왼쪽 (상영중) */}
        <div className="flex flex-col w-1/3 space-y-2 border border-gray-800 rounded-sm p-2">
          <p className="text-2xl text-white">상영중</p>
          {Object.entries(groupedPosters)
            .filter(([, posters]) => posters[0].type === "상영중")
            .map(([locationId, posters]) => (
              <Card
                key={locationId}
                className="bg-gray-800 border-gray-700 bg-opacity-30 text-white rounded-sm p-2"
              >
                <p className="text-lg">{posters[0].location_name}</p>
                <CardContent className="flex gap-1 flex-wrap">
                  {posters.map((slot) => (
                    <div
                      key={slot.id}
                      onClick={() => assignPosterToSlot(slot.id)}
                      className="flex flex-col items-center justify-center bg-gray-700 bg-opacity-30 border border-gray-800 rounded-sm cursor-pointer hover:bg-gray-700 max-w-32"
                    >
                      {slot.poster_url ? (
                        <img
                          src={slot.poster_url}
                          alt={slot.title || "포스터"}
                          className="w-28 h-40 object-cover rounded-sm"
                        />
                      ) : (
                        <div className="w-28 h-40 bg-gray-600 flex items-center justify-center text-sm rounded-sm">
                          {selectedMovie ? "클릭하여 추가" : "없음"}
                        </div>
                      )}
                      <p className="w-28 mt-1 text-sm truncate text-center">
                        {slot.title || `포스터 슬롯 ${slot.order_num}`}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
        </div>

        {/* 🎬 오른쪽 (상영 예정 + 기타) */}
        <div className="flex flex-col w-1/3 space-y-2 border border-gray-800 rounded-sm p-2">
        <p className="text-2xl text-white">상영 예정</p>
          {Object.entries(groupedPosters)
            .filter(([, posters]) => posters[0].type !== "상영중")
            .map(([locationId, posters]) => (
              <Card
                key={locationId}
                className="bg-gray-800 border-gray-700 bg-opacity-30 text-white rounded-sm p-2"
              >
                <p className="text-lg">{posters[0].location_name}</p>
                <CardContent className="flex gap-1 flex-wrap">
                  {posters.map((slot) => (
                    <div
                      key={slot.id}
                      onClick={() => assignPosterToSlot(slot.id)}
                      className="flex flex-col items-center justify-center bg-gray-700 bg-opacity-30 border border-gray-800 rounded-sm cursor-pointer hover:bg-gray-700 max-w-32"
                    >
                      {slot.poster_url ? (
                        <img
                          src={slot.poster_url}
                          alt={slot.title || "포스터"}
                          className="w-28 h-40 object-cover rounded-sm"
                        />
                      ) : (
                        <div className="w-28 h-40 bg-gray-600 flex items-center justify-center text-sm rounded-sm">
                          {selectedMovie ? "클릭하여 추가" : "없음"}
                        </div>
                      )}
                      <p className="w-28 mt-1 text-sm truncate text-center">
                        {slot.title || `포스터 슬롯 ${slot.order_num}`}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

export default PosterList;
