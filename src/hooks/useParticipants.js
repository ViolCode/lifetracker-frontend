import { useState } from "react";
import { getParticipants, inviteParticipant, removeParticipant, searchUsers } from "../api/events";
import toast from "react-hot-toast";

export function useParticipants(eventId) {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);

    async function load() {
        try {
            setLoading(true);
            const data = await getParticipants(eventId);
            setParticipants(data);
        } catch {
            toast.error("Failed to load participants");
        } finally {
            setLoading(false);
        }
    }

    async function invite(user) {
        try {
            await inviteParticipant(eventId, user.id);
            toast.success(`${user.name} added to event`);
            await load();
        } catch (e) {
            toast.error(e.message || "Failed to add participant");
            throw e;
        }
    }

    async function remove(participant) {
        try {
            await removeParticipant(eventId, participant.userId);
            toast.success(`${participant.userName} removed`);
            await load();
        } catch (e) {
            toast.error(e.message || "Failed to remove participant");
            throw e;
        }
    }

    async function search(query) {
        return await searchUsers(eventId, query);
    }

    return { participants, loading, load, invite, remove, search };
}
