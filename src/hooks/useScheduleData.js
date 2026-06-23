import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../api/events";
import { getParticipants } from "../api/participants";
import toast from "react-hot-toast";

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
                    } catch {
                        return { ...event, participants: [] };
                    }
                })
            );
            setEvents(eventsWithParticipants);
        } catch (error) {
            toast.error(`Could not load your schedule. ${error.message}`);
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