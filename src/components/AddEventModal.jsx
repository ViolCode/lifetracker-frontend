import { useState, useEffect } from "react";
import { createEvent, updateEvent } from "../api/events";
import { getExpenses } from "../api/expenses";
import EventForm from "./EventForm";
import ExpenseSection from "./ExpenseSection";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";

export default function AddEventModal({ onClose, onSaved, existing }) {

    const emptyForm = {
        title: "",
        description: "",
        location: "",
        plannedDate: "",
        startTime: "",
        endTime: "",
    };

    const [form, setForm] = useState(emptyForm);
    const [expenses, setExpenses] = useState([]);

    // INIT EVENT FORM
    useEffect(() => {
        if (!existing) {
            setForm(emptyForm);
            setExpenses([]);
            return;
        }

        setForm({
            title: existing.title || "",
            description: existing.description || "",
            location: existing.location || "",
            plannedDate: existing.plannedDate || "",
            startTime: existing.startTime?.slice(0, 5) || "",
            endTime: existing.endTime?.slice(0, 5) || "",
        });
    }, [existing]);

    // LOAD EXPENSES (ONLY FOR EDIT MODE)
    useEffect(() => {
        if (!existing?.id) return;

        const load = async () => {
            const data = await getExpenses(existing.id);
            setExpenses(data);
        };

        load();
    }, [existing?.id]);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async () => {
        if (!form.title) return alert("Title required");

        const result = existing
            ? await updateEvent(existing.id, form)
            : await createEvent(form);

        onSaved(result);
        onClose();
    };

    const refreshExpenses = async () => {
        const data = await getExpenses(existing.id);
        setExpenses(data);
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader title={existing ? "Edit Event" : "Add Event"} />

            <EventForm form={form} onChange={handleChange} />

            {existing?.id && (
                <ExpenseSection
                    expenses={expenses}
                    eventId={existing.id}
                    onCreated={refreshExpenses}
                />
            )}

            <ModalFooter
                onCancel={onClose}
                onSubmit={handleSubmit}
                submitText={existing ? "Update" : "Create"}
            />
        </Modal>
    );
}