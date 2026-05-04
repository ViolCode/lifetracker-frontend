export default function ModalFooter({ onCancel, onSubmit, submitText }) {
    return (
        <div className="flex justify-end gap-2 mt-4">
            <button onClick={onCancel}>Cancel</button>
            <button
                onClick={onSubmit}
                className="bg-teal-500 text-white px-4 py-2 rounded"
            >
                {submitText}
            </button>
        </div>
    );
}