import { useEffect, useState, useCallback } from "react";
import { getEvents } from "../api/events";

export function useEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getEvents();
            setEvents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return {
        events,
        loading,
        reload: load,
    };
}