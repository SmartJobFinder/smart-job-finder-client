import parse from "html-react-parser";

export default function JobHeaderCard({ job, isRecording }) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-100">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-sm text-gray-700">
            {job.company} • {job.location}
          </p>
          <p className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Level: {job.level}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            AI Interview Coach
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Status: {isRecording ? "Recording..." : "Ready"}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-700">
        {job.description && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Job Description
            </h4>

            <div className="prose prose-sm text-gray-600 max-w-none">
              {parse(job.description)}
            </div>
          </div>
        )}

        <div>
          <p className="font-semibold text-gray-800 mb-1">Requirements:</p>
          <div className="prose prose-sm text-gray-600 max-w-none">
            {job.requirements ? (
              parse(job.requirements)
            ) : (
              <p className="italic text-gray-400">No requirements provided</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
