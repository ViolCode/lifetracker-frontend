import { formatTime } from "../utils/format";
import { deleteEvent } from "../api/events";

export default function EventCard({ event, onClick, onDeleted }) {

    const handleDelete = async (e) => {
        e.stopPropagation();

        await deleteEvent(event.id);

        onDeleted(event.id); // instant UI update
    };

    return (
        <div
            className="flex items-start gap-4 cursor-pointer"
            onClick={onClick}
        >
            <div className="min-w-[90px] text-sm text-gray-500 mt-3">
                {formatTime(event.startTime, event.endTime)}
            </div>

            <div className="flex-1 bg-[#E8F5E9] rounded-xl p-4 flex justify-between">
                <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.location}</p>
                </div>

                <button
                    onClick={handleDelete}
                    className="text-xs text-red-500"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}