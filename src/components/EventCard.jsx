import React from "react";
import { formatTime } from "../utils/format";
import { deleteEvent } from "../api/events";

export default function EventCard({ event, onClick, onDeleted }) {

    const handleDelete = async (e) => {
        e.stopPropagation();

        if (!confirm("Delete this event?")) return;

        await deleteEvent(event.id);
        onDeleted();
    };

    return (
        <div className="flex items-start gap-4 cursor-pointer" onClick={onClick}>

            <div className="min-w-[90px] text-sm text-gray-500 mt-3">
                {formatTime(event.startTime, event.endTime)}
            </div>

            <div className="relative flex-1 bg-[#E8F5E9] rounded-xl shadow-sm p-4 flex justify-between hover:shadow-md transition">

                <div>
                    <h3 className="font-semibold">{event.title}</h3>

                    {event.location && (
                        <p className="text-sm text-gray-600">{event.location}</p>
                    )}

                    {event.description && (
                        <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    )}
                </div>

                <div className="text-right flex flex-col justify-between gap-2">
                    {event.plannedBudget && (
                        <span className="text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded">
                            €{event.plannedBudget}
                        </span>
                    )}

                    <button
                        onClick={handleDelete}
                        className="text-xs text-red-500 hover:underline"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}