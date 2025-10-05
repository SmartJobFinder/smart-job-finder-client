"use client";
export default function SkillsChips({ skills = [] }) {
  if (!skills.length) return null;
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Skills Requirements</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <span
            key={`${skill}-${idx}`}
            className="border border-blue-500 text-blue-600 px-3 py-1 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}