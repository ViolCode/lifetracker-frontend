import { useState } from "react";

import Header from "../components/Header";
import EventSection from "../components/EventSection";
import EventModal from "../components/EventModal";
import ExpenseModal from "../components/ExpenseModal";
import { groupedEvents } from "../utils/groupedEvents";
import { getTodayLabel, getTomorrowLabel, getWeeklyPlanningLabel } from "../utils/format";
import { useEvents } from "../hooks/useEvents";
import { createExpense, getExpenses } from "../api/expenses";
import { deleteEvent } from "../api/events";
import toast from "react-hot-toast";

export default function SchedulePage() {

    const {
        events,
        loadEvents,
        removeEvent,
    } = useEvents();

    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showExpenses, setShowExpenses] = useState(false);
    const [expenseEvent, setExpenseEvent] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [weekOffset, setWeekOffset] = useState(0);
    const [expenseLoading, setExpenseLoading] = useState(false);

    const grouped = groupedEvents(events, weekOffset);

    async function handleSaved() {

        await loadEvents();

        setShowModal(false);

        setSelectedEvent(null);
    }

    function handleEdit(event) {

        setSelectedEvent(event);

        setShowModal(true);
    }

    async function handleOpenExpenses(event) {

        const data = await getExpenses(event.id);

        setExpenses(data);

        setExpenseEvent(event);

        setShowExpenses(true);
    }

    async function reloadExpenses() {

        if (!expenseEvent) {
            return;
        }

        const data = await getExpenses(
            expenseEvent.id
        );

        setExpenses(data);
    }

    async function handleCreateExpense(data) {

        if (!expenseEvent) {
            return;
        }

        try {

            setExpenseLoading(true);

            await createExpense({
                eventId: expenseEvent.id,
                ...data,
            });

            await reloadExpenses();
            await loadEvents();

            toast.success("Expense added");

        } catch (e) {

            toast.error(e.message);

        } finally {

            setExpenseLoading(false);
        }
    }

    async function handleDeleteEvent(event) {

        const confirmed = window.confirm(
            `Delete "${event.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteEvent(event.id);

            removeEvent(event.id);

        } catch (e) {

            alert(
                e.message ||
                "Failed to delete event"
            );
        }
    }



    return (
        <div className="p-6 max-w-7xl mx-auto h-full overflow-y-auto">

            <Header
                title="Schedule"
                action={
                    <button onClick={() => {
                            setSelectedEvent(null);
                            setShowModal(true);
                        }}
                        className="px-4 py-2 rounded-lg bg-teal-500 text-white">
                        + Add Event
                    </button>
                }
            />

            {showModal && (
                <EventModal
                    existing={selectedEvent}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedEvent(null);
                    }}
                    onSaved={handleSaved}
                />
            )}

            {showExpenses && expenseEvent && (
                <ExpenseModal
                    event={expenseEvent}
                    expenses={expenses}
                    loading={expenseLoading}
                    onCreate={handleCreateExpense}
                    onClose={() => {
                        setShowExpenses(false);
                        setExpenseEvent(null);
                    }}
                    onReload={reloadExpenses}
                />
            )}

            <EventSection
                title="Today"
                subtitle={getTodayLabel()}
                events={grouped.today}
                onEventClick={handleEdit}
                onDelete={handleDeleteEvent}
                onExpensesClick={handleOpenExpenses}
            />

            <EventSection
                title="Tomorrow"
                subtitle={getTomorrowLabel()}
                events={grouped.tomorrow}
                onEventClick={handleEdit}
                onDelete={handleDeleteEvent}
                onExpensesClick={handleOpenExpenses}
            />

            <div className="mb-4">

                <div
                    className="
            flex
            items-center
            justify-between
            mb-4
        "
                >

                    <div
                        className="
                flex
                items-center
                gap-6
            "
                    >

                        <h2 className="text-2xl font-semibold">
                            Weekly Planning
                        </h2>

                        <div
                            className="
                    flex
                    items-center
                    gap-4
                "
                        >

                            <button
                                onClick={() =>
                                    setWeekOffset(prev => prev - 1)
                                }
                                className="
                        text-lg
                        text-gray-500
                        hover:text-black
                    "
                            >
                                ←
                            </button>

                            <span
                                className="
                        text-sm
                        text-gray-500
                    "
                            >
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
                        onClick={() => setWeekOffset(0)}
                        className=" px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600">
                        Current Week
                    </button>

                </div>

                <EventSection
                    events={grouped.week}
                    onEventClick={handleEdit}
                    onDelete={handleDeleteEvent}
                    onExpensesClick={handleOpenExpenses}
                    showEventDates
                />
            </div>
        </div>
    );
}