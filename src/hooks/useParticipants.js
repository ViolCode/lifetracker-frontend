import { useState } from "react";
import { getParticipants, inviteParticipant, removeParticipant, searchUsers } from "../api/participants";

export function useParticipants(eventId) {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);

    async function load() {
        try {
            setLoading(true);
            const data = await getParticipants(eventId);
            setParticipants(data);
        } catch {
            // error handled silently
        } finally {
            setLoading(false);
        }
    }

    async function invite(user) {
        try {
            await inviteParticipant(eventId, user.id);
            await load();
        } catch (e) {
            throw e;
        }
    }

    async function remove(participant) {
        try {
            await removeParticipant(eventId, participant.userId);
            await load();
        } catch (e) {
            throw e;
        }
    }

    async function search(query) {
        return await searchUsers(eventId, query);
    }

    return { participants, loading, load, invite, remove, search };
}
