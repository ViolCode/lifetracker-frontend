import { formatTime, formatDate } from "../utils/format";

export default function EventCard({
                                      event,
                                      onClick,
                                      onDelete,
                                      onExpensesClick,
                                      showDate = false,
                                  }) {

    function handleDelete(e) {
        e.stopPropagation();

        onDelete(event);
    }

    return (
        <div className="flex items-start gap-2 cursor-pointer" onClick={onClick}>
            <div className="w-[105px] text-sm text-gray-500 pt-2 flex-shrink-0">

                {showDate && (
                    <div className="mb-1">
                        {formatDate(event.plannedDate)}
                    </div>
                )}

                <div>
                    {formatTime(
                        event.startTime,
                        event.endTime
                    )}
                </div>

            </div>

            <div className="flex-1 bg-[#E8F5E9] rounded-xl p-4 flex justify-between items-center hover:shadow-sm transition">
                <div>
                    <h3 className="font-semibold">
                        {event.title}
                    </h3>

                    <p className="text-sm text-gray-600">
                        {event.location}
                    </p>
                </div>

                <div className="flex items-center gap-4">

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onExpensesClick(event);
                        }}
                        className="text-sm font-medium text-teal-700 hover:text-teal-900">
                        €{event.totalExpenses || 0}
                    </button>

                    <button
                        onClick={handleDelete}
                        className="text-xs text-red-500 hover:text-red-700">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}