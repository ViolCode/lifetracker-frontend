export function groupedEvents(events) {
    const today = [];
    const tomorrow = [];
    const week = [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfToday.getDate() + 1);

    const startOfDayAfterTomorrow = new Date(startOfToday);
    startOfDayAfterTomorrow.setDate(startOfToday.getDate() + 2);

    const startOfNextWeek = new Date(startOfToday);
    startOfNextWeek.setDate(startOfToday.getDate() + 7);

    events.forEach(event => {
        const date = new Date(event.plannedDate || event.planned_date);

        const eventDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (eventDay.getTime() === startOfToday.getTime()) {
            today.push(event);
        } else if (eventDay.getTime() === startOfTomorrow.getTime()) {
            tomorrow.push(event);
        } else if (
            eventDay.getTime() >= startOfDayAfterTomorrow.getTime() &&
            eventDay.getTime() <= startOfNextWeek.getTime()
        ) {
            week.push(event);
        }
    });

    return { today, tomorrow, week };
}
