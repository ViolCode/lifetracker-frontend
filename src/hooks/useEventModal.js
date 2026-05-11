import { useState } from "react";

export function useEventModal() {

    const [showModal, setShowModal] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState(null);

    function openCreate() {

        setSelectedEvent(null);

        setShowModal(true);
    }

    function openEdit(event) {

        setSelectedEvent(event);

        setShowModal(true);
    }

    function closeModal() {

        setShowModal(false);

        setSelectedEvent(null);
    }

    return {
        showModal,
        selectedEvent,

        openCreate,
        openEdit,
        closeModal,
    };
}