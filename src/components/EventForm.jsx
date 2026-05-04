
export default function EventForm({ form, onChange }) {
    return (
        <div className="flex flex-col gap-3">
            <input name="title" value={form.title} onChange={onChange} placeholder="Title" className="input" />
            <input name="location" value={form.location} onChange={onChange} placeholder="Location" className="input" />
            <textarea name="description" value={form.description} onChange={onChange} placeholder="Notes" className="input" />
            <input type="date" name="plannedDate" value={form.plannedDate} onChange={onChange} className="input" />
            <input type="time" name="startTime" value={form.startTime} onChange={onChange} className="input" />
            <input type="time" name="endTime" value={form.endTime} onChange={onChange} className="input" />
        </div>
    );
}