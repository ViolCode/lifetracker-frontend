import { useState } from "react";

import Header from "../components/Header";
import EventSection from "../components/EventSection";
import EventModal from "../components/EventModal";

import { groupedEvents } from "../utils/groupedEvents";
import { useEvents } from "../hooks/useEvents";

export default function SchedulePage() {

    const {
        events,
        loadEvents,
        removeEvent,
    } = useEvents();

    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const grouped = groupedEvents(events);

    async function handleSaved(savedEvent) {
        await loadEvents();

        setShowModal(false);
        setSelectedEvent(null);
    }

    function handleEdit(event) {
        setSelectedEvent(event);
        setShowModal(true);
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">

            <Header
                title="Schedule"
                action={
                    <button
                        onClick={() => {
                            setSelectedEvent(null);
                            setShowModal(true);
                        }}
                        className="px-4 py-2 rounded-lg bg-teal-500 text-white"
                    >
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

            <EventSection
                title="Today"
                events={grouped.today}
                onEventClick={handleEdit}
                onDeleted={removeEvent}
            />

            <EventSection
                title="Tomorrow"
                events={grouped.tomorrow}
                onEventClick={handleEdit}
                onDeleted={removeEvent}
            />

            <EventSection
                title="This Week"
                events={grouped.week}
                onEventClick={handleEdit}
                onDeleted={removeEvent}
            />

        </div>
    );
}