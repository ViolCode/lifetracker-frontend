export function formatTime(startTime, endTime) {
    if (!startTime) return "Whole day";

    const start = startTime.slice(0, 5);
    const end = endTime ? endTime.slice(0, 5) : null;

    return end ? `${start} – ${end}` : start;
}
