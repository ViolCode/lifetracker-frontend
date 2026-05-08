export default function Button({
                                   children,
                                   className = "",
                                   ...props
                               }) {
    return (
        <button
            {...props}
            className={`
                px-4
                py-2
                rounded-lg
                transition
                ${className}
            `}
        >
            {children}
        </button>
    );
}