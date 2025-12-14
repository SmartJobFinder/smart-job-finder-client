"use client";

export default function CvSection({ title, children }) {
  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  );
}
