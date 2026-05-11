import { useEffect, useState } from "react";

import { getEvents, deleteEvent } from "../api/events";

export function useScheduleData() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadEvents() {

        try {

            setLoading(true);

            const data = await getEvents();

            setEvents(data.events || data);

        } finally {

            setLoading(false);
        }
    }

    async function removeEvent(event) {

        await deleteEvent(event.id);

        setEvents(prev =>
            prev.filter(e => e.id !== event.id)
        );
    }

    useEffect(() => {
        loadEvents();
    }, []);

    return {
        events,
        loading,
        reload: loadEvents,
        removeEvent,
    };
}