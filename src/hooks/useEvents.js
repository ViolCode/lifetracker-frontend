import { useEffect, useState } from "react";
import { getEvents } from "../api/events";

export function useEvents() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    async function loadEvents() {
        try {
            setLoading(true);

            const data = await getEvents();

            setEvents(data.events || data);

        } catch (e) {
            console.error("Failed to load events", e);

        } finally {
            setLoading(false);
        }
    }

    function removeEvent(id) {
        setEvents(prev =>
            prev.filter(e => e.id !== id)
        );
    }

    return {
        events,
        loading,
        loadEvents,
        removeEvent,
    };
}