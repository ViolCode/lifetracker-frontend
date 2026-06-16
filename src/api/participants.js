import { api } from "./client";

export const getParticipants = (eventId) =>
    api(`/events/${eventId}/participants`);

export const searchUsers = (eventId, query) =>
    api(`/events/${eventId}/participants/search?q=${encodeURIComponent(query)}`);

export const inviteParticipant = (eventId, userId) =>
    api(`/events/${eventId}/participants`, {
        method: "POST",
        body: JSON.stringify({ userId }),
    });

export const removeParticipant = (eventId, userId) =>
    api(`/events/${eventId}/participants/${userId}`, {
        method: "DELETE",
    });