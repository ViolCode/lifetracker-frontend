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
        const data = await getEvents();
        setEvents(data);
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const handleCreated = async () => {
        await loadEvents();
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Header />

            {showModal && (
                <AddEventModal
                    existing={selectedEvent}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedEvent(null);
                    }}
                    onCreated={handleCreated}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mt-6 mb-4">
                <h2 className="text-xl font-semibold">Today</h2>

                <button
                    onClick={() => {
                        setSelectedEvent(null);
                        setShowModal(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-teal-500 text-white"
                >
                    + Add Event
                </button>
            </div>

            <EventSection
                title=""
                events={groupedEvents(events).today}
                onEventClick={(e) => {
                    setSelectedEvent(e);
                    setShowModal(true);
                }}
            />

            <EventSection
                title="Tomorrow"
                events={groupedEvents(events).tomorrow}
                onEventClick={(e) => {
                    setSelectedEvent(e);
                    setShowModal(true);
                }}
            />

            <EventSection
                title="This Week"
                events={groupedEvents(events).week}
                onEventClick={(e) => {
                    setSelectedEvent(e);
                    setShowModal(true);
                }}
            />
        </div>
    );
}