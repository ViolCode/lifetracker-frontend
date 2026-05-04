import Header from "../components/Header";
import EventSection from "../components/EventSection";
import AddEventModal from "../components/AddEventModal";
import { useState, useEffect } from "react";
import { getEvents } from "../api/events";
import { groupedEvents } from "../utils/groupedEvents";

export default function SchedulePage() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const loadEvents = async () => {
        try {
            const data = await getEvents();
            setEvents(data.events || data);
        } catch (e) {
            console.error("Failed to load events", e);
        }
    };

    const removeEventFromState = (id) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const handleSaved = async (event) => {
        await loadEvents();

        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

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
                <AddEventModal
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
                events={groupedEvents(events).today}
                onEventClick={handleEdit}
                onEventDeleted={removeEventFromState}
            />

            <EventSection
                title="Tomorrow"
                events={groupedEvents(events).tomorrow}
                onEventClick={handleEdit}
                onEventDeleted={removeEventFromState}
            />

            <EventSection
                title="This Week"
                events={groupedEvents(events).week}
                onEventClick={handleEdit}
                onEventDeleted={removeEventFromState}
            />
        </div>
    );
}