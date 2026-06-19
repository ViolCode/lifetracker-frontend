import { useEffect, useState } from "react";

import Header from "../components/Header";
import HistoryEventCard from "../components/HistoryEventCard";

import { getEventHistory } from "../api/events";

import { sortHistoryEvents } from "../utils/historyEvents";

export default function EventHistoryPage() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    async function loadHistory() {

        try {

            const data = await getEventHistory();

            setEvents(sortHistoryEvents(data));

        } catch (e) {

            console.error("Failed to load history", e);

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {
        loadHistory();
    }, []);

    const filteredEvents = events.filter(event => {
        const q = searchQuery.toLowerCase();
        return (
            event.title?.toLowerCase().includes(q) ||
            event.location?.toLowerCase().includes(q) ||
            event.description?.toLowerCase().includes(q)
        );
    });

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto h-full flex flex-col">

            <Header title="Event History" />

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="space-y-4 overflow-y-auto pr-2">

                {filteredEvents.length === 0 && (
                    <p className="text-gray-500">
                        {searchQuery ? "No events match your search." : "No past events found."}
                    </p>
                )}

                {filteredEvents.map(event => (
                    <HistoryEventCard
                        key={event.id}
                        event={event}
                    />
                ))}
            </div>
        </div>
    );
}