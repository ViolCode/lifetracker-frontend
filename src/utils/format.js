export function formatTime(startTime, endTime) {
    if (!startTime) return "Whole day";

    const start = startTime.slice(0, 5);
    const end = endTime ? endTime.slice(0, 5) : null;

    return end ? `${start} – ${end}` : start;
}

export function formatDate(date) {

    if (!date) {
        return "";
    }

    return new Date(date).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }
    );
}

export function formatShortDate(date) {

    if (!date) {
        return "";
    }

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);

    return `${day}.${month}.${year}`;
}

export function getTodayLabel() {

    return formatDate(new Date());
}

export function getTomorrowLabel() {

    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    return formatDate(tomorrow);
}

export function getWeekRangeLabel() {

    const start = new Date();

    const end = new Date();

    end.setDate(end.getDate() + 7);

    return `${formatDate(start)} - ${formatDate(end)}`;
}

export function getWeeklyPlanningLabel( weekOffset = 0 ) {

    const start = new Date();

    start.setDate(
        start.getDate() + 2 + (weekOffset * 7)
    );

    const end = new Date(start);

    end.setDate(end.getDate() + 6);

    return `${formatShortDate(start)} - ${formatShortDate(end)}`;
}

export function formatScheduleDate(date) {

    if (!date) {
        return "";
    }

    return new Date(date).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        }
    );
}