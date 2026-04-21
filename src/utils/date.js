export function groupEventsByDate(events) {
    const today = [];
    const tomorrow = [];
    const upcoming = [];

    const now = new Date();
    const todayStr = now.toDateString();

    const tomorrowDate = new Date();
    tomorrowDate.setDate(now.getDate() + 1);
    const tomorrowStr = tomorrowDate.toDateString();

    events.forEach(event => {
        const eventDate = new Date(event.plannedDate);
        const eventStr = eventDate.toDateString();

        if (eventStr === todayStr) {
            today.push(event);
        } else if (eventStr === tomorrowStr) {
            tomorrow.push(event);
        } else {
            upcoming.push(event);
        }
    });

    return { today, tomorrow, upcoming };
}