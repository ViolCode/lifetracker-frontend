import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../api/events";
import { getParticipants } from "../api/events";

export function useScheduleData() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadEvents() {
        try {
            setLoading(true);
            const data = await getEvents();
            const eventsWithParticipants = await Promise.all(
                (data || []).map(async (event) => {
                    try {
                        const participants = await getParticipants(event.id);
                        return { ...event, participants };
                    } catch (error) {
                        console.error(`Failed to load participants for event ${event.id}`, error);
                        return { ...event, participants: [] };
                    }
                })
            );
            setEvents(eventsWithParticipants);
        } catch (error) {
            console.error("Failed to load events", error);
        } finally {
            setLoading(false);
        }
    }

    async function removeEvent(event) {
        await deleteEvent(event.id);
        setEvents(prev => prev.filter(e => e.id !== event.id));
    }

    useEffect(() => {
        loadEvents();
    }, []);

    return { events, loading, reload: loadEvents, removeEvent };
}