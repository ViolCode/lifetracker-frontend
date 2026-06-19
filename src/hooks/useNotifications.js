import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import toast from "react-hot-toast";

export function useNotifications() {
    const clientRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.id) return;

        const wsUrl = import.meta.env.VITE_API_URL.replace(/^http/, "ws") + "/ws";

        const client = new Client({
            brokerURL: wsUrl,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/notifications.${user.id}`, (message) => {
                    const { eventTitle, participantName, isRemoved } = JSON.parse(message.body);
                    if (isRemoved) {
                        toast(`${participantName} was removed from "${eventTitle}"`, { duration: 5000 });
                    } else {
                        toast(`${participantName} was added to "${eventTitle}"`, { duration: 5000 });
                    }
                });
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, []);
}