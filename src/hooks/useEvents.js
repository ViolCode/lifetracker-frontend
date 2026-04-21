import { useEffect, useState } from "react";
import { getEvents } from "../api/events.js";

export function useEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return {
        events,
        loading,
    };
}
