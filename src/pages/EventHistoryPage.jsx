import { useEffect, useState } from "react";
import Header from "../components/Header";
import HistoryEventCard from "../components/HistoryEventCard";
import { getEventHistory } from "../api/events";
import toast from "react-hot-toast";

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getGroupKey(dateStr, groupBy) {
    const d = new Date(dateStr);
    if (groupBy === "week") {
        const monday = getWeekStart(d);
        return monday.toISOString().slice(0, 10);
    }
    if (groupBy === "month") return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return String(d.getFullYear());
}

function getGroupLabel(key, groupBy) {
    if (groupBy === "week") {
        const monday = new Date(key);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        const fmt = d => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        return `${fmt(monday)} – ${fmt(sunday)}`;
    }
    if (groupBy === "month") {
        const [year, month] = key.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    }
    return key;
}

function groupEvents(events, groupBy) {
    const sorted = [...events].sort((a, b) => new Date(b.plannedDate) - new Date(a.plannedDate));
    const map = new Map();
    for (const event of sorted) {
        const key = getGroupKey(event.plannedDate, groupBy);
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(event);
    }
    return map;
}

export default function EventHistoryPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [groupBy, setGroupBy] = useState("week");

    async function loadHistory() {
        try {
            setLoading(true);
            setLoadError("");
            const data = await getEventHistory();
            setEvents(data);
        } catch (e) {
            const fullMsg = `Could not load your event history. ${e.message}`;
            setLoadError(fullMsg);
            toast.error(fullMsg);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadHistory();
    }, []);

    const filtered = events.filter(event => {
        const q = searchQuery.toLowerCase();
        return !q || (
            event.title?.toLowerCase().includes(q) ||
            event.location?.toLowerCase().includes(q) ||
            event.description?.toLowerCase().includes(q)
        );
    });

    const grouped = groupEvents(filtered, groupBy);

    if (loading) {
        return <div className="p-6 text-gray-500">Loading...</div>;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto h-full flex flex-col">

            <div className="flex justify-between items-start mb-6">
                <Header title="Event History" />

                <select
                    value={groupBy}
                    onChange={e => setGroupBy(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm bg-white"
                >
                    <option value="week">By Week</option>
                    <option value="month">By Month</option>
                    <option value="year">By Year</option>
                </select>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {loadError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm flex items-center gap-2">
                    <span>{loadError}</span>
                    <button onClick={loadHistory} className="ml-auto text-red-700 underline">
                        Retry
                    </button>
                </div>
            )}

            <div className="space-y-6 overflow-y-auto pr-2">
                {!loadError && grouped.size === 0 && (
                    <p className="text-gray-500">
                        {searchQuery ? "No events match your search." : "No past events found."}
                    </p>
                )}

                {[...grouped.entries()].map(([key, items]) => (
                    <div key={key}>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            {getGroupLabel(key, groupBy)}
                        </div>

                        <div className="space-y-4">
                            {items.map(event => (
                                <HistoryEventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}