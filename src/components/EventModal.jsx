import { createEvent, updateEvent } from "../api/events";
import Modal from "./Modal";
import EventForm from "./EventForm";
import { useEventForm } from "../hooks/useEventForm";
import toast from "react-hot-toast";

export default function EventModal({ existing, onClose, onSaved }) {
    const {
        form,
        handleChange,
    } = useEventForm(existing);

    async function handleSubmit() {
        if (!form.title.trim()) {
            toast.error("Title is required");
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
            const saved = existing
                ? await updateEvent(existing.id, form)
                : await createEvent(form);
            await onSaved(saved);
        } catch (e) {
            toast.error(e.message || "Failed to save event");
        }
    }

    return (
        <Modal onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">
                {existing ? "Edit Event" : "Add Event"}
            </h2>

            <EventForm form={form} onChange={handleChange} />

            <div className="flex justify-end gap-2 mt-4">
                <button onClick={onClose} className="px-4 py-2">
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-teal-500 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
            </div>
        </Modal>
    );
}