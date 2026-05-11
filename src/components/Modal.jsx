export default function Modal({
                                  children,
                                  onClose,
                              }) {
    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-xl w-[420px] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}