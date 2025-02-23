import { useEffect, useState } from "react";
import { getLocations, deleteLocation } from "@/apis/supabase";
import { getUserPosters } from "@/apis/supabase"; // ✅ 사용자의 포스터 데이터 가져오기
import { useAuthStore } from "@/stores/authStore";

export interface Location {
  id: string;
  name: string;
  max_posters: number;
  type: string;
  order_num: number;
}
export interface Poster {
  id: string;
  title: string;
  count: number;
  posterurl: string;
}

function Test() {
  const { user } = useAuthStore();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [assignedItems, setAssignedItems] = useState<
    Record<string, { id: string; title: string; type: "poster" | "custom" }[]>
  >({});
  const [posterCountTracker, setPosterCountTracker] = useState<
    Record<string, number>
  >({});
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    title: string;
    type: "poster" | "custom";
  } | null>(null);
  const [customItem, setCustomItem] = useState<string>("");


  useEffect(() => {
    async function fetchLocations() {
      if (!user) return;

      setLoading(true);
      const result = await getLocations(user.id);
      if (result.success) setLocations(result.data);
      setLoading(false);
    }

    async function fetchPosters() {
      if (!user) return;

      const result = await getUserPosters(user.id);
      if (result.success) setPosters(result.data);
    }

    fetchLocations();
    fetchPosters();
  }, [user]);

  

  const handleDelete = async (locationId: string) => {
    if (!window.confirm("정말로 이 위치를 삭제하시겠습니까?")) return;

    const result = await deleteLocation(locationId);
    alert(result.message);
    setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
  };

  const addPoster = (
    locationId: string,
    item: { id: string; title: string; type: "poster" | "custom" }
  ) => {
    setAssignedItems((prevAssigned) => {
      const currentItems = prevAssigned[locationId] || [];

      if (item.type === "poster") {
        const totalAssignedCount = posterCountTracker[item.id] || 0;
        const maxCount = posters.find((p) => p.id === item.id)?.count || 0;

        if (totalAssignedCount >= maxCount) {
          alert(`❌ ${item.title} 포스터 개수를 초과할 수 없습니다.`);
          return prevAssigned; // ✅ 개수 초과 시 추가하지 않음
        }
      }

      if (
        currentItems.length >=
        locations.find((loc) => loc.id === locationId)!.max_posters
      ) {
        return prevAssigned;
      }

      // ✅ 포스터 개수 업데이트를 `setAssignedItems` 내부에서 최신 상태로 반영
      const newPosterCount = { ...posterCountTracker };
      if (item.type === "poster") {
        newPosterCount[item.id] = (newPosterCount[item.id] || 0) + 1;
      }

      setPosterCountTracker(newPosterCount); // ✅ 최신 상태 반영

      return {
        ...prevAssigned,
        [locationId]: [...currentItems, item],
      };
    });
  };
  if (loading) return <div>Loading...</div>;

  const removePoster = (locationId: string, index: number) => {
    setAssignedItems((prev) => {
      const updatedItems = [...prev[locationId]];
      const removedItem = updatedItems[index];

      if (!removedItem) return prev;

      updatedItems.splice(index, 1);

      return { ...prev, [locationId]: updatedItems };
    });

    if (assignedItems[locationId]?.[index]?.type === "poster") {
      setPosterCountTracker((prevTracker) => {
        const currentCount =
          prevTracker[assignedItems[locationId][index].id] || 0;

        return {
          ...prevTracker,
          [assignedItems[locationId][index].id]: Math.max(0, currentCount - 1),
        };
      });
    }
  };

  const sortedLocations = [...locations].sort((a, b) => {
    if (a.type === "상영중" && b.type !== "상영중") return -1;
    if (a.type !== "상영중" && b.type === "상영중") return 1;
    return a.order_num - b.order_num;
  });

  

  return (
    <div className="bg-gray-900 p-4 rounded-md text-white">
      <h2 className="text-lg font-bold mb-3">📍 등록된 위치 목록</h2>

      {/* ✅ 기타 게시물 추가 */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">📌 기타 게시물 추가</h3>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="게시물 내용을 입력하세요"
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
            className="p-2 bg-gray-700 text-white rounded-md"
          />
          <button
            onClick={() => {
              if (customItem.trim() === "") return;
              setSelectedItem({
                id: `custom-${Date.now()}`,
                title: customItem,
                type: "custom",
              });
              setCustomItem("");
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded-md"
          >
            추가
          </button>
        </div>
      </div>

      {/* ✅ 보유한 포스터 목록 */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">🎬 보유한 포스터</h3>
        <div className="flex gap-2 mt-2">
          {posters.map((poster) => (
            <button
              key={poster.id}
              onClick={() =>
                setSelectedItem({
                  id: poster.id,
                  title: poster.title,
                  type: "poster",
                })
              }
              className={`bg-gray-700 justify-center w-28 pb-1 text-white rounded-md ${selectedItem?.id === poster.id ? "bg-blue-500" : ""}`}
            >
              <img src={poster.posterurl} alt={poster.title} className="w-auto h-auto rounded-md object-contain" />
              <div className="flex flex-col items-center justify-center">
              <p className="w-28 truncate px-2">{poster.title} </p>
              <p className="text-xs">{poster.count - (posterCountTracker[poster.id] || 0)}장 남음</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {sortedLocations.map((location) => (
        <li
          key={location.id}
          className="p-2 border-b border-gray-700 flex flex-col"
        >
          <div className="flex justify-between">
            <span>
              {location.name}
            </span>
            <button
              onClick={() => handleDelete(location.id)}
              className="bg-red-500 px-3 py-1 rounded-md"
            >
              삭제
            </button>
          </div>

          {/* ✅ 포스터 & 기타 게시물 배치 */}
          <div className="flex gap-2 mt-2">
            {Array.from({ length: location.max_posters }).map((_, index) => {
              const assignedItem = assignedItems[location.id]?.[index];
              const posterImage = posters.find(
                (p) => p.id === assignedItem?.id
              )?.posterurl; 

              return (
                <div
                  key={index}
                  className="h-40 w-40 bg-gray-700 rounded-md flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    if (assignedItem) {
                      removePoster(location.id, index); // ✅ 아이템 삭제
                    } else if (selectedItem) {
                      addPoster(location.id, selectedItem); // ✅ 아이템 추가
                    }
                  }}
                >
                  {assignedItem ? (
                    assignedItem.type === "poster" && posterImage ? (
                      <div className="flex flex-col items-center justify-center">
                        <img
                          src={posterImage}
                          alt={assignedItem.title}
                          className=" rounded-md object-cover"
                        />
                        <p>{assignedItem.title}</p>
                      </div>
                    ) : (
                      <span className="text-white text-xs">
                        {assignedItem.title}
                      </span>
                    )
                  ) : (
                    "📌"
                  )}
                </div>
              );
            })}
          </div>
        </li>
      ))}
    </div>
  );
}

export default Test;
