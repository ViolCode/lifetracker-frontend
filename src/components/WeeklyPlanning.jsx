import EventSection from "./EventSection";
import { getWeeklyPlanningLabel } from "../utils/format";

export default function WeeklyPlanning({
                                                  weekOffset,
                                                  setWeekOffset,
                                                  weekEvents,
                                                  onEventClick,
                                                  onDelete,
                                                  onExpensesClick,
                                              }) {

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6">

                    <h2 className="text-2xl font-semibold">
                        Weekly Planning
                    </h2>

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() =>
                                setWeekOffset(
                                    prev => prev - 1
                                )
                            }
                            className="text-lg text-gray-500 hover:text-black">
                            ←
                        </button>

                        <span className="text-sm text-gray-500">
                            {getWeeklyPlanningLabel(
                                weekOffset
                            )}
                        </span>

                        <button
                            onClick={() =>
                                setWeekOffset(prev => prev + 1)
                            }
                            className="text-lg text-gray-500 hover:text-black">
                            →
                        </button>
                    </div>
                </div>

                <button
                    onClick={() =>
                        setWeekOffset(0)
                    }
                    className="
                        px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600">
                    Current Week
                </button>

            </div>

            <EventSection
                events={weekEvents}
                onEventClick={onEventClick}
                onDelete={onDelete}
                onExpensesClick={onExpensesClick}
                showEventDates
            />

        </div>
    );
}