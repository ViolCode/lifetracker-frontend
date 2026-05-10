import { useEffect, useState } from "react";

import Header from "../components/Header";
import HistoryEventCard from "../components/HistoryEventCard";

import { getEventHistory } from "../api/events";

import { sortHistoryEvents } from "../utils/historyEvents";

export default function EventHistoryPage() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto h-full flex flex-col">

            <Header title="Event History" />

            <div className="space-y-4 overflow-y-auto pr-2">

                {events.length === 0 && (
                    <p className="text-gray-500">
                        No past events found.
                    </p>
                )}

                {events.map(event => (
                    <HistoryEventCard
                        key={event.id}
                        event={event}
                    />
                ))}
            </div>
        </div>
    );
}