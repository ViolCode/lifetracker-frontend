import { useEffect, useState } from "react";

import { getEvents } from "../api/events";

export function useEvents() {

    const [events, setEvents] = useState([]);

    const { loading, error, run } = useAsync();

    useEffect(() => {
        loadEvents();
    }, []);

    async function loadEvents() {

        await run(async () => {

            const data =
                await getEvents();

            setEvents(data.events || data);
        });
    }

    function removeEvent(id) {

        setEvents(prev =>
            prev.filter(e => e.id !== id)
        );
    }

    return {
        events,
        loading,
        error,
        loadEvents,
        removeEvent,
    };
}