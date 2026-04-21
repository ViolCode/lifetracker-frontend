import React, { useState, useEffect } from "react";
import { createEvent, updateEvent } from "../api/events";
import { getExpenses } from "../api/expenses";
import AddExpenseForm from "./AddExpenseForm";

export default function AddEventModal({ onClose, onCreated, existing }) {

    const emptyForm = {
        title: "",
        description: "",
        location: "",
        plannedDate: "",
        startTime: "",
        endTime: "",
        plannedBudget: "",
    };

    const [form, setForm] = useState(emptyForm);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        if (!existing) {
            setForm(emptyForm);
            return;
        }

        setForm({
            title: existing.title || "",
            description: existing.description || "",
            location: existing.location || "",
            plannedDate: existing.plannedDate || "",
            startTime: existing.startTime?.slice(0, 5) || "",
            endTime: existing.endTime?.slice(0, 5) || "",
            plannedBudget: existing.plannedBudget ?? "",
        });

    }, [existing?.id]);

    useEffect(() => {
        if (existing) {
            loadExpenses();
        }
    }, [existing?.id]);

    const loadExpenses = async () => {
        const data = await getExpenses(existing.id);
        setExpenses(data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.title) {
            alert("Title is required");
            return;
        }

        const payload = {
            ...form,
            plannedBudget: form.plannedBudget
                ? parseFloat(form.plannedBudget)
                : null,
        };

        let result;

        if (existing) {
            result = await updateEvent(existing.id, payload);
        } else {
            result = await createEvent(payload);
        }

        onCreated(result);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[420px] max-h-[90vh] overflow-y-auto">

                <h2 className="text-xl font-semibold mb-4">
                    {existing ? "Edit Event" : "Add Event"}
                </h2>

                <div className="flex flex-col gap-3">
                    <input name="title" value={form.title} placeholder="Title" onChange={handleChange} className="input" />
                    <input name="location" value={form.location} placeholder="Location" onChange={handleChange} className="input" />
                    <textarea name="description" value={form.description} placeholder="Notes" onChange={handleChange} className="input" />
                    <input type="date" name="plannedDate" value={form.plannedDate} onChange={handleChange} className="input" />
                    <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="input" />
                    <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className="input" />
                    <input name="plannedBudget" value={form.plannedBudget} placeholder="Budget €" onChange={handleChange} className="input" />
                </div>

                {existing && (
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Expenses</h3>

                        {expenses.map((e) => (
                            <div key={e.id} className="text-sm mb-1">
                                €{e.amount} — {e.description}
                            </div>
                        ))}

                        <AddExpenseForm
                            eventId={existing.id}
                            onCreated={loadExpenses}
                        />
                    </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose}>Cancel</button>
                    <button
                        onClick={handleSubmit}
                        className="bg-teal-500 text-white px-4 py-2 rounded"
                    >
                        {existing ? "Update" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}