import { formatTime } from "../utils/format";

export default function HistoryEventCard({ event }) {
    return (
        <div className="bg-gray-100 rounded-xl p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold">
                        {event.title}
                    </h3>

                    <p className="text-sm text-gray-600">
                        {event.location}
                    </p>

                    {event.description && (
                        <p className="text-sm mt-2 text-gray-700">
                            {event.description}
                        </p>
                    )}
                </div>

                <div className="text-sm text-gray-500 text-right">

                    <div>
                        {event.plannedDate}
                    </div>

                    <div>
                        {formatTime(event.startTime, event.endTime)}
                    </div>
                </div>
            </div>
        </div>
    );
}