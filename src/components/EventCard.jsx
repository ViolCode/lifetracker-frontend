import { formatTime, formatDate } from "../utils/format";

export default function EventCard({
                                      event,
                                      onClick,
                                      onDelete,
                                      onExpensesClick,
                                      onAddParticipant,
                                      showDate = false
                                  }) {
    function handleDelete(e) {
        e.stopPropagation();
        onDelete(event);
    }

    function handleAddParticipant(e) {
        e.stopPropagation();
        onAddParticipant(event);
    }

    function handleExpensesClick(e) {
        e.stopPropagation();
        onExpensesClick(event);
    }

    return (
        <div className="flex items-start gap-2 cursor-pointer" onClick={onClick}>
            <div className="w-[105px] text-sm text-gray-500 pt-2 flex-shrink-0">
                {showDate && (
                    <div className="mb-1">{formatDate(event.plannedDate)}</div>
                )}
                <div>{formatTime(event.startTime, event.endTime)}</div>
            </div>

            <div className="flex-1 bg-[#E8F5E9] rounded-xl p-4 hover:shadow-sm transition">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.location}</p>

                        {/* Display participants right under event name */}
                        {event.participants && event.participants.length > 0 && (
                            <div className="mt-2">
                                <div className="text-xs text-gray-500 mb-1">Participants:</div>
                                <div className="flex flex-wrap gap-1">
                                    {event.participants.map(participant => (
                                        <span
                                            key={participant.id}
                                            className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                                            title={participant.userEmail}
                                        >
                                            {participant.userName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                        <button
                            onClick={handleAddParticipant}
                            className="text-sm font-medium text-purple-600 hover:text-purple-800"
                            title="Add participant"
                        >
                            + Add
                        </button>

                        <button
                            onClick={handleExpensesClick}
                            className="text-sm font-medium text-teal-700 hover:text-teal-900"
                        >
                            €{event.totalExpenses?.toFixed(2) || "0.00"}
                        </button>

                        <button
                            onClick={handleDelete}
                            className="text-xs text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}