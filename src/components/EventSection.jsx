import EventCard from "./EventCard";

export default function EventSection({
                                         title,
                                         subtitle,
                                         events,
                                         onEventClick,
                                         onExpensesClick,
                                         onDelete,
                                         showEventDates = false,
                                     }) {

    return (
        <div className="mb-8">

            <div
                className="flex items-center gap-3 mb-4">

                <h2 className="text-2xl font-semibold">
                    {title}
                </h2>

                {subtitle && (
                    <span className="text-gray-500 text-sm">
                        {subtitle}
                    </span>
                )}

            </div>

            <div className="space-y-3">

                {events.map(event => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => onEventClick(event)}
                        onExpensesClick={onExpensesClick}
                        onDelete={onDelete}
                        showDate={showEventDates}
                    />
                ))}
            </div>
        </div>
    );
}