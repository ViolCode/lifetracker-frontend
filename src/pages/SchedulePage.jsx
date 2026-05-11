import { useState } from "react";

import Header from "../components/Header";
import EventSection from "../components/EventSection";
import EventModal from "../components/EventModal";
import ExpenseModal from "../components/ExpenseModal";
import WeeklyPlanning from "../components/WeeklyPlanning.jsx";
import { groupedEvents } from "../utils/groupedEvents";
import { getTodayLabel, getTomorrowLabel } from "../utils/format";
import { useScheduleData } from "../hooks/useScheduleData";
import { useExpenseManager } from "../hooks/useExpenseManager";
import { useEventModal } from "../hooks/useEventModal";

export default function SchedulePage() {

    const [weekOffset, setWeekOffset] =
        useState(0);

    const {
        events,
        reload,
        removeEvent,
    } = useScheduleData();

    const {
        showModal,
        selectedEvent,
        openCreate,
        openEdit,
        closeModal,
    } = useEventModal();

    const {
        showExpenses,
        expenseEvent,
        expenses,
        loading,
        openExpenses,
        closeExpenses,
        reloadExpenses,
        addExpense,
    } = useExpenseManager(reload);

    const grouped = groupedEvents(
        events,
        weekOffset
    );

    async function handleDelete(event) {

        const confirmed = window.confirm(
            `Delete "${event.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await removeEvent(event);

        } catch (e) {

            alert(
                e.message ||
                "Failed to delete event"
            );
        }
    }

    async function handleSaved() {

        await reload();

        closeModal();
    }

    return (
        <div className="p-6 max-w-7xl mx-auto h-full overflow-y-auto">

            <Header
                title="Schedule"
                action={
                    <button
                        onClick={openCreate}
                        className="px-4 py-2 rounded-lg bg-teal-500 text-white">
                        + Add Event
                    </button>
                }
            />

            {showModal && (
                <EventModal
                    existing={selectedEvent}
                    onClose={closeModal}
                    onSaved={handleSaved}
                />
            )}

            {showExpenses && expenseEvent && (
                <ExpenseModal
                    event={expenseEvent}
                    expenses={expenses}
                    loading={loading}
                    onCreate={addExpense}
                    onClose={closeExpenses}
                    onReload={reloadExpenses}
                />
            )}

            <EventSection
                title="Today"
                subtitle={getTodayLabel()}
                events={grouped.today}
                onEventClick={openEdit}
                onDelete={handleDelete}
                onExpensesClick={openExpenses}
            />

            <EventSection
                title="Tomorrow"
                subtitle={getTomorrowLabel()}
                events={grouped.tomorrow}
                onEventClick={openEdit}
                onDelete={handleDelete}
                onExpensesClick={openExpenses}
            />

            <WeeklyPlanning
                weekOffset={weekOffset}
                setWeekOffset={setWeekOffset}
                weekEvents={grouped.week}
                onEventClick={openEdit}
                onDelete={handleDelete}
                onExpensesClick={openExpenses}
            />

        </div>
    );
}