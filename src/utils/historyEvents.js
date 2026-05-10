export function sortHistoryEvents(events) {

    return [...events].sort((a, b) => {
        return new Date(b.plannedDate) - new Date(a.plannedDate);
    });
}