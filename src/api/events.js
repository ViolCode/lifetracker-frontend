import { request } from "./client";

export const getEvents = () => request("/events");

export const createEvent = (data) =>
    request("/events", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateEvent = (id, data) =>
    request(`/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const deleteEvent = (id) =>
    request(`/events/${id}`, {
        method: "DELETE",
    });