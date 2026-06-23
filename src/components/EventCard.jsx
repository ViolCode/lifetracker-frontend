import { formatTime, formatDate } from "../utils/format";

export default function EventCard({
    event,
    onClick,
    onDelete,
    onExpensesClick,
    onAddParticipant,
    showDate = false,
}) {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isOwner = event.ownerId === currentUser.id;
    const myParticipation = !isOwner
        ? event.participants?.find(p => p.userId === currentUser.id)
        : null;

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
        <div
            className={`flex items-start gap-2 ${isOwner ? "cursor-pointer" : ""}`}
            onClick={isOwner ? onClick : undefined}
        >
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

                        {myParticipation && (
                            <p className="text-xs text-indigo-500 mt-1">
                                Shared by {myParticipation.invitedByName}
                            </p>
                        )}

                        {isOwner && event.participants?.length > 0 && (
                            <div className="mt-2">
                                <div className="text-xs text-gray-500 mb-1">Participants:</div>
                                <div className="flex flex-wrap gap-1">
                                    {event.participants.map(p => (
                                        <span
                                            key={p.id}
                                            className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                                            title={p.userEmail}
                                        >
                                            {p.userName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                        {isOwner && (
                            <button
                                onClick={handleAddParticipant}
                                className="text-sm font-medium text-purple-600 hover:text-purple-800"
                            >
                                + People
                            </button>
                        )}

                        <button
                            onClick={handleExpensesClick}
                            className="text-sm font-medium text-teal-700 hover:text-teal-900"
                        >
                            + €{event.totalExpenses?.toFixed(2) || "0.00"}
                        </button>

                        {isOwner && (
                            <button
                                onClick={handleDelete}
                                className="text-xs text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
