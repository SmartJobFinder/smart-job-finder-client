"use client";
export default function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-2">
      <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
        <Icon className="w-5 h-5 text-blue-500" />
        {title}
      </div>
      <div className="text-gray-700 whitespace-pre-line">{children}</div>
    </div>
  );
}