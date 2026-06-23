import { useState } from "react";
import { createEvent, updateEvent } from "../api/events";
import Modal from "./Modal";
import EventForm from "./EventForm";
import { useEventForm } from "../hooks/useEventForm";

export default function EventModal({ existing, onClose, onSaved }) {
    const { form, handleChange } = useEventForm(existing);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit() {
        if (!form.title.trim()) {
            setError("Title is required.");
            return;
        }

        const unchanged = existing && JSON.stringify(form) === JSON.stringify({
            title: existing?.title || "",
            description: existing?.description || "",
            location: existing?.location || "",
            plannedDate: existing?.plannedDate || "",
            startTime: existing?.startTime?.slice(0, 5) || "",
            endTime: existing?.endTime?.slice(0, 5) || "",
        });

        if (existing && unchanged) {
            onClose();
            return;
        }

        try {
            setLoading(true);
            setError("");
            const saved = existing
                ? await updateEvent(existing.id, form)
                : await createEvent(form);
            await onSaved(saved);
        } catch (e) {
            setError(existing
                ? `Could not update the event. ${e.message}`
                : `Could not create the event. ${e.message}`
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">
                {existing ? "Edit Event" : "Add Event"}
            </h2>

            <EventForm form={form} onChange={handleChange} />

            {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">
                    {error}
                </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
                <button onClick={onClose} className="px-4 py-2">
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-teal-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </Modal>
    );
}