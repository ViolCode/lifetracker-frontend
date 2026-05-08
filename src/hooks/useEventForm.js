import { useEffect, useState } from "react";

const initialState = {
    title: "",
    description: "",
    location: "",
    plannedDate: "",
    startTime: "",
    endTime: "",
};

export function useEventForm(existing) {

    const [form, setForm] = useState(initialState);

    useEffect(() => {

        if (!existing) {
            setForm(initialState);
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

    function handleChange(e) {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    return {
        form,
        handleChange,
        setForm,
    };
}