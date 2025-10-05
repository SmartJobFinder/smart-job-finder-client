import { useSelector } from "react-redux";
import { selectProfileCompletion } from "@/features/profile/profileSlice";
import { CheckCircle, AlertCircle, PlusCircle, PartyPopper } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileSidebarRight() {
      const router = useRouter();

      const handleClick = () => {
          router.push("/manageCv");
      };

    const completion = useSelector(selectProfileCompletion);

    const percent = completion.percent;

    return (
        <aside className="w-full">
            <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
                <h2 className="mb-6 text-xl font-bold text-center text-gray-800">
                    Profile Strength
                </h2>

                <div className="flex justify-center mb-4">
                    <div className="relative flex items-center justify-center w-32 h-32">
                        <svg className="w-32 h-32 transform rotate-90 scale-x-[-1]">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#e5e7eb"
                                strokeWidth="10"
                                fill="transparent"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="url(#gradient)"
                                strokeWidth="10"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 56}
                                strokeDashoffset={
                                    2 * Math.PI * 56 -
                                    (2 * Math.PI * 56 * percent) / 100
                                }
                                strokeLinecap="round"
                                className="transition-all duration-500"
                            />
                            <defs>
                                <linearGradient
                                    id="gradient"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%"
                                >
                                    {" "}
                                    <stop offset="0%" stopColor="#2563eb" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute text-center">
                            <p className="text-xl font-bold text-blue-800">
                                {percent}%
                            </p>
                            <p className="text-xs text-gray-500">completed</p>
                        </div>
                    </div>
                </div>

                <div className="p-3 mb-6 text-sm text-gray-700 border rounded-lg bg-gray-50">
                    {percent >= 70 ? (
                        <div className="flex-1">
                            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-800 ">
                                <PartyPopper size={28} /> Congratulations!
                            </p>
                            <p className="mt-2 text-xs text-center text-gray-600">
                                You are ready to generate your CV. Keep
                                completing your profile for a more attractive
                                CV.
                            </p>
                        </div>
                    ) : (
                        <p className="flex items-center justify-center gap-2 text-red-600">
                            <AlertCircle size={18} /> Need {70 - percent}% more
                            to complete CV
                        </p>
                    )}
                </div>

                {completion.missingSections.length > 0 && (
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-semibold text-gray-700">
                            You still need to complete:
                        </p>
                        <ul className="space-y-2 text-sm">
                            {completion.missingSections.map((sec, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-2 text-orange-600 hover:underline"
                                >
                                    <PlusCircle
                                        size={18}
                                        className="align-middle shrink-0"
                                    />
                                    <span className="text-sm capitalize align-middle">
                                        {sec.replace(/([A-Z])/g, " $1")}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    onClick={handleClick}
                    className="flex items-center justify-center w-full gap-2 py-3 text-sm font-bold text-white transition-colors bg-blue-800 rounded-lg shadow-md hover:bg-blue-600"
                >
                    Preview & Download CV
                </button>
            </div>
        </aside>
    );
}
