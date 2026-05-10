export function groupedEvents(events, weekOffset = 0) {

    const today = [];
    const tomorrow = [];
    const week = [];

    const now = new Date();

    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const startOfTomorrow = new Date(startOfToday);

    startOfTomorrow.setDate(
        startOfTomorrow.getDate() + 1
    );

    const startOfWeek = new Date(startOfToday);

    startOfWeek.setDate(
        startOfWeek.getDate() + 2 + (weekOffset * 7)
    );

    const endOfWeek = new Date(startOfWeek);

    endOfWeek.setDate(
        endOfWeek.getDate() + 6
    );

    events.forEach(event => {

        const date = new Date(event.plannedDate);

        const eventDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

        if (
            eventDay.getTime() === startOfToday.getTime()
        ) {
            today.push(event);
        }

        else if (
            eventDay.getTime() === startOfTomorrow.getTime()
        ) {
            tomorrow.push(event);
        }

        if (
            eventDay >= startOfWeek &&
            eventDay <= endOfWeek
        ) {
            week.push(event);
        }
    });

    week.sort((a, b) =>
        new Date(a.plannedDate) -
        new Date(b.plannedDate)
    );

    return {
        today,
        tomorrow,
        week,
    };
}