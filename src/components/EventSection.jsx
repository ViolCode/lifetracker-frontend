import React from "react";
import EventCard from "./EventCard";

export default function EventSection({ title, events, onEventClick }) {
    return (
        <div className="mb-6">
            {title && <h3 className="text-xl font-semibold mb-3">{title}</h3>}

            <div className="space-y-3">
                {events.map((e) => (
                    <div
                        key={e.id}
                        onClick={() => onEventClick(e)}
                        className="cursor-pointer"
                    >
                        <EventCard event={e} />
                    </div>
                ))}
            </div>
        </div>
    );
}