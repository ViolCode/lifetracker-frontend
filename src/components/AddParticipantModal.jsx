import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import { searchUsers, inviteParticipant } from "../api/events";
import toast from "react-hot-toast";

export default function AddParticipantModal({ event, onClose, onParticipantAdded }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const searchTimer = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                await performSearch();
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(searchTimer);
    }, [searchQuery]);

    async function performSearch() {
        if (searchQuery.length < 2) return;

        try {
            setLoading(true);
            const results = await searchUsers(event.id, searchQuery);
            setSearchResults(results);
            setShowDropdown(results.length > 0);
            setSelectedIndex(-1);
        } catch (error) {
            toast.error("Failed to search users");
        } finally {
            setLoading(false);
        }
    }

    async function handleInvite(user) {
        try {
            setLoading(true);
            await inviteParticipant(event.id, user.id);
            toast.success(`${user.name} has been added to the event`);
            setSearchQuery("");
            setSearchResults([]);
            setShowDropdown(false);
            if (onParticipantAdded) onParticipantAdded();
            onClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e) {
        if (!showDropdown) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < searchResults.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleInvite(searchResults[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    }

    function highlightMatch(text, query) {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ?
                <span key={index} className="bg-yellow-200 font-semibold">{part}</span> : part
        );
    }

    return (
        <Modal onClose={onClose}>
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Add Participant</h2>
                <p className="text-gray-500 text-sm mt-1">Event: {event.title}</p>
            </div>

            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search for user by name or email
                </label>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type at least 2 characters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                    className="input w-full"
                    autoFocus
                />

                {loading && (
                    <div className="absolute right-3 top-9">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
                    </div>
                )}

                {showDropdown && searchResults.length > 0 && (
                    <div
                        ref={dropdownRef}
                        className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto"
                    >
                        {searchResults.map((user, index) => (
                            <div
                                key={user.id}
                                className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                                    index === selectedIndex ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => handleInvite(user)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div className="font-medium">
                                    {highlightMatch(user.name, searchQuery)}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {highlightMatch(user.email, searchQuery)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {searchQuery.length >= 2 && !loading && searchResults.length === 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                        No users found matching "{searchQuery}"
                    </div>
                )}

                {searchQuery.length > 0 && searchQuery.length < 2 && (
                    <div className="mt-2 text-sm text-gray-400">
                        Type at least 2 characters to search
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <button onClick={onClose} className="px-4 py-2 rounded-lg border">
                    Cancel
                </button>
            </div>
        </Modal>
    );
}