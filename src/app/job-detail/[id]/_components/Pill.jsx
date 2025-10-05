"use client";
export default function Pill({ icon: Icon, children, className = "" }) {
  return (
    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${className}`}>
      <Icon size={16} />
      {children}
    </span>
  );
}