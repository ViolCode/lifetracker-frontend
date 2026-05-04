import React from "react";

export default function Header({ title, action }) {
    return (
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            {action}
        </div>
    );
}