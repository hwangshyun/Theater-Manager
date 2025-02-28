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

interface LocationListProps {
  title: string;
  type: "상영중" | "상영 예정" | "기타";
  groupedPosters: Record<string, PosterSlot[]>;
  selectedLocation: string | null;
  handleMoveLocation: (locationId: string) => void;
  handleDeleteLocation: (locationId: string) => void;
  assignPosterToSlot: (slotId: string) => void;
  selectedMovie: Movie | null;
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
}: LocationListProps) {
  return (
    <Accordion
      type="multiple"
      className="border-none flex flex-col"
      defaultValue={[title]}
    >
      <AccordionItem className="m-0 border-b border-gray-600" value={title}>
        <AccordionTrigger className="p-0 pb-2 text-lg text-white">
          {title}
        </AccordionTrigger>
        <AccordionContent className="pb-2 ">
          <div className="flex flex-wrap gap-4">
            {Object.entries(groupedPosters)
              .filter(([, posters]) => posters[0].type === type)
              .map(([locationId, posters]) => (
                <Card
                  key={locationId}
                  className={`px-1 pb-1 bg-gray-800 border-gray-700 bg-opacity-30 text-white rounded-smflex flex-col h-full max-h-48
                    ${selectedLocation === locationId ? " border-green-800" : ""}
                  `}
                >
                  <p className="flex items-center justify-between text-lg text-center mb-">
                    {posters[0].location_name}
                    <div className="flex items-center gap-1 no-print">
                      <FaRegCircle
                        className={`border-2 border-gray-700 text-gray-400 rounded-full size-3 cursor-pointer hover:text-green-400 ${
                          selectedLocation === locationId
                            ? "border-2 border-green-400 scale-100"
                            : ""
                        }`}
                        onClick={() => handleMoveLocation(locationId)}
                      />
                      <MdDeleteOutline
                        className="text-red-600 cursor-pointer size-4"
                        onClick={() => handleDeleteLocation(locationId)}
                      />
                    </div>
                  </p>

                  <CardContent
                    className={`grid gap-2`}
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(posters.length)}, minmax(80px, 1fr))`,
                    }}
                  >
                    {posters.map((slot) => (
                      <div
                        key={slot.id}
                        onClick={() => assignPosterToSlot(slot.id)}
                        className="p-2 h-full w-full flex flex-col items-center justify-center bg-gray-700 bg-opacity-30 border border-gray-800 rounded-sm cursor-pointer hover:bg-gray-700"
                      >
                        {slot.poster_url ? (
                          <img
                            src={slot.poster_url}
                            alt={slot.title || "포스터"}
                            className="max-h-28 rounded-sm"
                          />
                        ) : (
                          <div className="w-full h-28  bg-gray-600 flex items-center justify-center text-sm rounded-sm">
                            {selectedMovie ? "클릭하여 추가" : "없음"}
                          </div>
                        )}
                        <p className="max-w-20 mt-1 text-sm truncate text-center">
                          {slot.title || `포스터 슬롯 ${slot.order_num}`}
                        </p>
                      </div>
                    ))}
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
