import { api } from "./client";

export const getEvents = () =>
    api("/events");

export const createEvent = (data) =>
    api("/events", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateEvent = (id, data) =>
    api(`/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const deleteEvent = (id) =>
    api(`/events/${id}`, {
        method: "DELETE",
    });