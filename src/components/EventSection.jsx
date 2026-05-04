import EventCard from "./EventCard";

export default function EventSection({ title, events, onEventClick, onDeleted }) {
    return (
        <div className="mb-6">
            {title && <h3 className="text-xl font-semibold mb-3">{title}</h3>}

            <div className="space-y-3">
                {events.map((e) => (
                    <EventCard
                        key={e.id}
                        event={e}
                        onClick={() => onEventClick(e)}
                        onDeleted={onDeleted}
                    />
                ))}
            </div>
        </div>
    );
}