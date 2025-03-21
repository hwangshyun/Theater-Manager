import {
  deleteLocation,
  deletePosterLocation,
  getLocations,
  getPosterLocation,
  getUserPosters,
  swapLocationOrder,
  updatePosterLocation,
} from "@/apis/supabase";
import { toast } from "@/components/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AddPostModal from "@/pages/poster/components/add-post-modal"; // 🔹 컴포넌트 가져오기
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useRef, useState } from "react";
import AddLocationModal from "./add-location-modal";
import LocationList from "./location-list";
import { IoPrintOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import GuideModal from "./guide-modal";

const ITEMS_PER_PAGE = 10;

// import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
export type PosterSlot = {
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

export type Movie = {
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
  const [posterCounts, setPosterCounts] = useState<Record<string, number>>({}); // 배치된 개수 추적
  const [selectedPost, setSelectedPost] = useState<{
    title: string;
    content: string;
    image: string | null;
  } | null>(null);
  const user = useAuthStore((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  

  useEffect(() => {
    // 빈 공간 클릭 시 초기화
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("movie-list");
      if (sidebar && sidebar.contains(event.target as Node)) return; //  영화 목록 내부 클릭 시 무시

      setSelectedPost(null);
      setSelectedMovie(null); // 빈 공간 클릭 시 선택 해제
    };

    window.addEventListener("click", handleClickOutside);
    
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const printRef = useRef<HTMLDivElement>(null);

  // ✅ 프린트 핸들러 (한 페이지에 모든 데이터를 포함하여 인쇄)
  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
  
      document.body.innerHTML = `
        <style>
          @page { 
            size: A4 portrait; /* A4 세로 모드 */
            margin: 0; /* ✅ 페이지 여백 제거 */
          }
  
          /* ✅ 전체 페이지 내 모든 여백 및 패딩 제거 */
          * { 
            font-family: Arial, sans-serif; 
            -webkit-print-color-adjust: exact; /* ✅ 색상 정확하게 출력 */
            margin: 0 !important;
            padding: 0 !important;
            line-height: 1.1 !important; /* ✅ 글자 간격 줄이기 */
            font-size: 12px !important; /* ✅ 글자 크기 줄이기 */
          }
  
          /* ✅ 모든 요소를 한 페이지에 맞게 출력 */
          html, body {
            overflow: hidden !important;
            height: auto !important;
          }
  
          .no-print { display: none !important; } /* ✅ 불필요한 UI 숨김 */
  
          /* ✅ 출력 레이아웃 최적화 */
          .print-container { 
            display: grid;
            height: auto !important;
            max-height: none !important; /* ✅ 페이지 나누기 방지 */
            grid-template-columns: 1fr 1fr; /* ✅ 2열 레이아웃으로 공간 최적화 */
            gap: 5px; /* ✅ 간격 최소화 */
            justify-content: center;
          }
  
          /* ✅ 개별 카드가 한 페이지에서 분리되지 않도록 설정 */
          .print-card { 
            break-inside: avoid; /* ✅ 페이지 내부에서 나눠지지 않도록 설정 */
            break-after: avoid; /* ✅ 다음 페이지로 넘어가지 않도록 설정 */
            text-align: center;
          }
  
          .print-title { 
            font-size: 10px; 
            font-weight: bold; 
            text-align: center; 
            margin-bottom: 5px;
          }
  
          .print-header { 
            text-align: center; 
            font-size: 14px; 
            font-weight: bold; 
            margin-bottom: 5px;
          }
  
          img { 
            height: auto; 
            margin-bottom: 2px;
            max-width: 100%; /* ✅ 이미지 크기 자동 조정 */
          }
        </style>
        <div class="print-container">${printContents}</div>
      `;
  
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);

  // 현재 페이지에 해당하는 영화 리스트
  const paginatedMovies = movies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (user) {
      fetchPosterSlots();
      fetchMovies();
    }
  }, [user]);
  async function fetchPosterSlots() {
    if (!user) return;

    try {
      const [locationResult, posterSlotResult] = await Promise.all([
        getLocations(user.id),
        getPosterLocation(user.id),
      ]);

      if (!locationResult.success || !locationResult.data.length) {
        console.warn("⚠️ 위치 데이터 없음!");
        setGroupedPosters({});
        return;
      }
      if (!posterSlotResult.success || !posterSlotResult.data.length) {
        console.warn("⚠️ 포스터 슬롯 데이터 없음!");
        setGroupedPosters({});
        return;
      }

      const locations = locationResult.data;
      const posterSlots = posterSlotResult.data;

      // order_num 기준 정렬 (DB에서 올바르게 반영됐는지 확인)
      const sortedLocations = locations.sort(
        (a, b) => a.order_num - b.order_num
      );

      const grouped = sortedLocations.reduce(
        (acc: Record<string, PosterSlot[]>, loc) => {
          acc[loc.id] = posterSlots
            .filter((slot) => slot.location === loc.id)
            .sort((a, b) => a.order_num - b.order_num)
            .slice(0, loc.max_posters);

          return acc;
        },
        {}
      );

      setGroupedPosters(grouped);
      updatePosterCounts(grouped);

      console.log("📌 최종 groupedPosters (위치 순서 반영):", grouped);
    } catch (error) {
      console.error("🚨 fetchPosterSlots 오류:", error);
      setGroupedPosters({});
    }
  }
  async function handleDeleteLocation(locationId: string) {
    const confirmDelete = window.confirm("정말로 이 위치를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    const { success, message } = await deleteLocation(locationId);

    if (success) {
      toast({ title: message });
      fetchPosterSlots(); // 🔄 위치 목록 다시 불러오기
    } else {
      toast({ title: "위치 삭제 실패", description: message });
    }
  }
  async function fetchMovies() {
    if (!user) return;

    const { success, data } = await getUserPosters(user.id);
    setMovies(success ? data : []);
  }

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

    const { success } = await deletePosterLocation(slotId);
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
        selectedPost.image ?? ""
      );
      if (success) fetchPosterSlots();
    } else {
      // 선택된 영화나 게시물이 없는 경우 포스터 삭제
      await deletePosterFromSlot(slotId);
    }
  }
  const handlePostSubmit = (
    title: string,
    content: string,
    image?: string | null
  ) => {
    console.log("🟢 PosterList의 handlePostSubmit 실행됨");
    console.log("받은 제목:", title);
    console.log("받은 내용:", content);
    console.log("받은 이미지:", image);

    if (!title.trim()) {
      alert("게시물 제목을 입력하세요.");
      return;
    }

    setSelectedPost({ title, content, image: image ?? "" });
    setSelectedMovie(null);
  };

  async function handleMoveLocation(locationId: string) {
    if (!user) return;

    // 첫 번째 위치 선택
    if (!selectedLocation) {
      setSelectedLocation(locationId);
      return;
    }

    // 같은 위치를 다시 클릭하면 선택 해제
    if (selectedLocation === locationId) {
      setSelectedLocation(null);
      return;
    }

    // 두 번째 위치 선택 후 교환 실행
    const locations = Object.entries(groupedPosters)
      .map(([location, posters]) => ({
        location,
        location_name: posters[0]?.location_name || "",
        orderNum: posters[0]?.order_num ?? 0,
        posters,
      }))
      .sort((a, b) => a.orderNum - b.orderNum);

    const firstLocation = locations.find(
      (loc) => loc.location === selectedLocation
    );
    const secondLocation = locations.find((loc) => loc.location === locationId);

    if (!firstLocation || !secondLocation) {
      console.warn("⚠️ 선택한 위치를 찾을 수 없음!");
      setSelectedLocation(null);
      return;
    }

    console.log(
      `🔄 위치 변경 요청: ${firstLocation.location}(${firstLocation.orderNum}) ↔ ${secondLocation.location}(${secondLocation.orderNum})`
    );

    // 🔹 Supabase에 순서 업데이트 요청
    const success = await swapLocationOrder(
      firstLocation.location,
      secondLocation.location
    );

    if (success) {
      await fetchPosterSlots(); // 변경된 데이터 다시 가져오기
      toast({ title: "위치 변경 완료" });
    } else {
      toast({ title: "위치 변경 실패" });
    }

    setSelectedLocation(null);
  }
  return (
    <div className=" flex gap-4 ml-12">
      {/* 🎬 현재 보유한 영화 목록 (선택 가능) */}
      <div className="max-w-72 ml-4">
        <div className="flex flex-col w-full max-w-1/6">
          <div className="flex justify-between mb-2 gap-1">
            {/* 기타 게시물 추가 버튼 */}
            <AddPostModal onSubmit={handlePostSubmit} />

            {/* 위치 추가 모달 */}
            <AddLocationModal />
            <Button
              onClick={handlePrint}
              className=" no-print bg-gray-900 bg-opacity-80 border border-gray-600 rounded-sm hover:bg-gray-800 hover:bg-opacity-80 hover:border-gray-500"
            >
              <IoPrintOutline />
            </Button>
            <GuideModal />
          </div>
          <div className="flex flex-col items-center h-auto max-h-full">
            {movies.length === 0 ? (
              <p className="text-gray-400 text-center">영화를 추가해주세요.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {paginatedMovies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMovie(movie);
                    }}
                    className={`border border-gray-600 h-full  bg-gray-600 flex flex-col items-center justify-center bg-opacity-40 rounded-sm cursor-pointer
                ${selectedMovie?.id === movie.id ? "border-2 border-white scale-105" : ""}`}
                  >
                    <img
                      src={movie.posterurl || ""}
                      alt={movie.title}
                      className="max-w-24 object-cover rounded-sm"
                    />
                    <p className="text-center text-xs min-w-12 max-w-20 text-gray-400 truncate">
                      {movie.title}
                    </p>
                    <p className="text-xs">
                      {posterCounts[movie.title] || 0}/{movie.count}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {movies.length > ITEMS_PER_PAGE && (
              <Pagination className="flex ">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={`cursor-pointer hover:text-white hover:bg-transparent hover:scale-110t ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-white text-xs flex">
                      {currentPage} / {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={`cursor-pointer  hover:text-white hover:bg-transparent hover:scale-110 ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
      {/* 🎭 포스터 슬롯 */}
      <div className="flex w-full">
        <div ref={printRef}>
          {/* ✅ LocationList 3개를 포함하여 출력 */}
          <LocationList
            title="상영중"
            type="상영중"
            groupedPosters={groupedPosters}
            selectedLocation={selectedLocation}
            handleMoveLocation={handleMoveLocation}
            handleDeleteLocation={handleDeleteLocation}
            assignPosterToSlot={assignPosterToSlot}
            selectedMovie={selectedMovie}
            isLoading={false}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <LocationList
            title="상영 예정"
            type="상영 예정"
            groupedPosters={groupedPosters}
            selectedLocation={selectedLocation}
            handleMoveLocation={handleMoveLocation}
            handleDeleteLocation={handleDeleteLocation}
            assignPosterToSlot={assignPosterToSlot}
            selectedMovie={selectedMovie}
            isLoading={false}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <LocationList
            title="기타"
            type="기타"
            groupedPosters={groupedPosters}
            selectedLocation={selectedLocation}
            handleMoveLocation={handleMoveLocation}
            handleDeleteLocation={handleDeleteLocation}
            assignPosterToSlot={assignPosterToSlot}
            selectedMovie={selectedMovie}
            isLoading={false}
             onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PosterList;
