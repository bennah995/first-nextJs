export default function Button({ variant = "primary", className = "", children, ...props }) {
  const base = "inline-flex items-center justify-center px-6 py-3 rounded font-medium transition";
  const variants = {
    primary: "bg-brand text-white hover:opacity-90 disabled:opacity-50",
    secondary: "bg-white text-brand border border-brand hover:bg-gray-50",
    ghost: "text-brand hover:bg-gray-100",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}