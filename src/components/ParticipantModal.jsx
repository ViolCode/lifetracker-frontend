import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import { useParticipants } from "../hooks/useParticipants";
import toast from "react-hot-toast";

export default function ParticipantModal({ event, onClose, onUpdate }) {
    const { participants, loading, load, invite, remove, search } = useParticipants(event.id);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searching, setSearching] = useState(false);
    const [inviting, setInviting] = useState(false);
    const [removingId, setRemovingId] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        function handleOutsideClick(e) {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                inputRef.current && !inputRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                await performSearch();
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    async function performSearch() {
        try {
            setSearching(true);
            const data = await search(query);
            setResults(data);
            setShowDropdown(data.length > 0);
            setSelectedIndex(-1);
        } catch (e) {
            toast.error(`Search failed. ${e.message}`);
            setResults([]);
        } finally {
            setSearching(false);
        }
    }

    async function handleInvite(user) {
        try {
            setInviting(true);
            await invite(user);
            setQuery("");
            setResults([]);
            setShowDropdown(false);
            if (onUpdate) onUpdate();
        } catch (e) {
            toast.error(`Could not add ${user.name}. ${e.message}`);
        } finally {
            setInviting(false);
        }
    }

    async function handleRemove(participant) {
        if (!window.confirm(`Remove ${participant.userName} from this event?`)) return;
        try {
            setRemovingId(participant.userId);
            await remove(participant);
            if (onUpdate) onUpdate();
        } catch (e) {
            toast.error(`Could not remove ${participant.userName}. ${e.message}`);
        } finally {
            setRemovingId(null);
        }
    }

    function handleKeyDown(e) {
        if (!showDropdown || results.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, -1));
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault();
            handleInvite(results[selectedIndex]);
        } else if (e.key === "Escape") {
            setShowDropdown(false);
        }
    }

    function highlightMatch(text, q) {
        if (!q || !text) return text;
        const parts = text.split(new RegExp(`(${q})`, "gi"));
        return parts.map((part, i) =>
            part.toLowerCase() === q.toLowerCase()
                ? <span key={i} className="bg-yellow-200 font-semibold">{part}</span>
                : part
        );
    }

    function getInitials(name) {
        if (!name) return "?";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }

    return (
        <Modal onClose={onClose}>
            <div className="mb-5">
                <h2 className="text-xl font-semibold">Participants</h2>
                <p className="text-sm text-gray-500 mt-0.5">{event.title}</p>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Invite someone
                </label>
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search by name or email..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => results.length > 0 && setShowDropdown(true)}
                        className="input w-full pr-9"
                        disabled={inviting}
                        autoFocus
                    />

                    {(searching || inviting) && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-500" />
                        </div>
                    )}

                    {showDropdown && results.length > 0 && (
                        <div
                            ref={dropdownRef}
                            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto"
                        >
                            {results.map((user, i) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => handleInvite(user)}
                                    onMouseEnter={() => setSelectedIndex(i)}
                                    className={`w-full text-left px-3 py-2.5 border-b last:border-b-0 transition-colors ${
                                        i === selectedIndex ? "bg-teal-50" : "hover:bg-gray-50"
                                    }`}
                                >
                                    <div className="text-sm font-medium">
                                        {highlightMatch(user.name, query)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {highlightMatch(user.email, query)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {query.length >= 2 && !searching && results.length === 0 && (
                    <p className="text-sm text-gray-400 mt-1.5">No users found for "{query}"</p>
                )}
                {query.length > 0 && query.length < 2 && (
                    <p className="text-xs text-gray-400 mt-1.5">Type at least 2 characters to search</p>
                )}
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Current participants ({participants.length})
                </h3>

                {loading ? (
                    <div className="flex justify-center py-6">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500" />
                    </div>
                ) : participants.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                        No participants yet. Add someone above!
                    </p>
                ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {participants.map(p => (
                            <div key={p.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                    {getInitials(p.userName)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{p.userName}</div>
                                    <div className="text-xs text-gray-500 truncate">{p.userEmail}</div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleRemove(p)}
                                        disabled={removingId === p.userId}
                                        className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
                                    >
                                        {removingId === p.userId ? "..." : "Remove"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}