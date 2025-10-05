import { Mail, Gift, MapPin, Phone, User, Link } from "lucide-react";
import Image from "next/image";
import { format, parse, isValid } from "date-fns";
import { useState } from "react";

const PersonalDetailSection = ({ data }) => {
    const displayAvatar = data?.avatar?.trim() || null;
    // const isValidUrl =
    //     typeof displayAvatar === "string" &&
    //     (displayAvatar.startsWith("http") || displayAvatar.startsWith("https"));

    const isValidUrl =
        typeof displayAvatar === "string" &&
        (displayAvatar.startsWith("http") || displayAvatar.startsWith("https"));
    const [imageError, setImageError] = useState(false); 
    const handleImageError = (e) => {
        e.currentTarget.style.display = "none"; 
        setImageError(true); 
    };
    const formatDateForDisplay = (dateStr) => {
        if (!dateStr) return "Your Date of Birth Here";
        const parsed = parse(dateStr, "yyyy-MM-dd", new Date());
        return isValid(parsed) ? format(parsed, "dd/MM/yyyy") : "Invalid Date";
    };

    return (
        <div className="space-y-4 text-gray-700 text-md">
            <div className="flex items-center gap-2">
                <div className="relative w-[60px] h-[60px]">
                    <div className="flex items-center justify-center w-full h-full overflow-hidden bg-gray-100 rounded-full">
                        {isValidUrl ? (
                            <Image
                                src={displayAvatar}
                                alt="User Avatar"
                                className="object-cover object-center w-full h-full rounded-full"
                                onError={handleImageError} 
                                width={60}
                                height={60}
                            />
                        ) : (
                            <span className="text-xs text-gray-400">
                                Update your image
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-black">
                        {data.fullName || "Your Name Here"}
                    </h1>
                    <p className="mt-2 font-semibold text-gray-600 text-md">
                        {data.title || "Your Title Here"}
                    </p>
                </div>
            </div>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="w-full space-y-2 sm:w-1/2">
                    <p className="flex items-center font-bold">
                        <Mail size={18} className="mr-2 text-gray-500" />
                        {data.email || "Your Email Here"}
                    </p>
                    <p className="flex items-center">
                        <Gift size={18} className="mr-2 text-gray-500" />
                        {formatDateForDisplay(data.dateOfBirth)}
                    </p>
                    <p className="flex items-center">
                        <Link size={18} className="mr-2 text-gray-500" />
                        {data.personalLink ? (
                            <a
                                href={data.personalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-base text-blue-500 hover:underline truncate max-w-[200px] inline-block align-middle"
                                title={data.personalLink}
                            >
                                {data.personalLink}
                            </a>
                        ) : (
                            "Your Personal Link Here"
                        )}
                    </p>
                    {/* <p className="flex items-center">
                        <MapPin size={18} className="mr-2 text-gray-500" />
                        {data.address || "Your Address Here"}
                    </p> */}
                </div>
                <div className="w-full space-y-2 sm:w-1/2">
                    <p className="flex items-center">
                        <Phone size={18} className="mr-2 text-gray-500" />
                        {data.phone || "Your Phone Number Here"}
                    </p>
                    <p className="flex items-center">
                        <User size={18} className="mr-2 text-gray-500" />
                        {data.gender || "Your Gender Here"}
                    </p>
                    {/* <p className="flex items-center">
                        <Link size={18} className="mr-2 text-gray-500" />
                        {data.personalLink ? (
                            <a
                                href={data.personalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-base text-blue-500 hover:underline truncate max-w-[200px] inline-block align-middle"
                                title={data.personalLink}
                            >
                                {data.personalLink}
                            </a>
                        ) : (
                            "Your Personal Link Here"
                        )}
                    </p> */}
                </div>
            </div>
        </div>
    );
};

export default PersonalDetailSection;