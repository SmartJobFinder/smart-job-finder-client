"use client";

export default function SkillsSection({ skills = [] }) {
  if (!skills?.length) return <p className="text-sm text-gray-500">-</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, idx) => (
        <span
          key={idx}
          className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
