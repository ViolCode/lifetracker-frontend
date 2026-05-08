import { createEvent, updateEvent } from "../api/events";
import { getExpenses } from "../api/expenses";

import { useEffect, useState } from "react";

import Modal from "./Modal";
import EventForm from "./EventForm";
import ExpenseSection from "./ExpenseSection";

import { useEventForm } from "../hooks/useEventForm";

export default function EventModal({existing, onClose, onSaved}) {

    const {
        form,
        handleChange,
    } = useEventForm(existing);

    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        if (!existing?.id) return;

        loadExpenses();
    }, [existing]);

    async function loadExpenses() {
        const data = await getExpenses(existing.id);
        setExpenses(data);
    }

    async function handleSubmit() {

        if (!form.title.trim()) {
            alert("Title required");
            return;
        }

        const unchanged =
            JSON.stringify(form) ===
            JSON.stringify({
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

        const saved = existing
            ? await updateEvent(existing.id, form)
            : await createEvent(form);

        await onSaved(saved);
    }

    return (
        <Modal onClose={onClose}>

            <h2 className="text-xl font-semibold mb-4">
                {existing ? "Edit Event" : "Add Event"}
            </h2>

            <EventForm
                form={form}
                onChange={handleChange}
            />

            {existing?.id && (
                <ExpenseSection
                    eventId={existing.id}
                    expenses={expenses}
                    onCreated={loadExpenses}
                />
            )}

            <div className="flex justify-end gap-2 mt-4">
                <button onClick={onClose}>
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