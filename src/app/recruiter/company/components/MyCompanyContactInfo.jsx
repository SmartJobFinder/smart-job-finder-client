"use client";

import React from "react";
import useMyCompanyStore from "../store/myCompanyStore";
import {
    MapPin,
    Mail,
    Phone,
    Globe,
    Facebook,
    Linkedin,
    Twitter,
    Map,
} from "lucide-react";
import { t } from "@/i18n/i18n";

const MyCompanyContactInfo = () => {
    const { company } = useMyCompanyStore();

    if (!company) return null;

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl">
            <h2 className="px-4 py-2 text-lg font-semibold text-white rounded bg-[#0A66C2]">
                {t`Contact Information`}
            </h2>
            <div className="mt-4 space-y-3 text-sm">
                <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0A66C2]" />
                    <strong>Address:</strong> {company.address},{" "}
                    {company.locationCity}, {company.locationCountry}
                </p>
                <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#0A66C2]" />
                    <strong>Email:</strong>{" "}
                    <a
                        href={`mailto:${company.email}`}
                        className="text-blue-600 hover:underline"
                    >
                        {company.email}
                    </a>
                </p>
                <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#0A66C2]" />
                    <strong>Phone:</strong>{" "}
                    <a
                        href={`tel:${company.phoneNumber}`}
                        className="text-blue-600 hover:underline"
                    >
                        {company.phoneNumber}
                    </a>
                </p>
                <p className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#0A66C2]" />
                    <strong>Website:</strong>{" "}
                    <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {company.website}
                    </a>
                </p>

                {company.facebookUrl && (
                    <p className="flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-[#0A66C2]" />
                        <strong>Facebook:</strong>{" "}
                        <a
                            href={company.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {company.facebookUrl.replace(
                                "https://facebook.com/",
                                ""
                            )}
                        </a>
                    </p>
                )}

                {company.linkedinUrl && (
                    <p className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                        <strong>LinkedIn:</strong>{" "}
                        <a
                            href={company.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {company.linkedinUrl.replace(
                                "https://linkedin.com/company/",
                                ""
                            )}
                        </a>
                    </p>
                )}

                {company.twitterUrl && (
                    <p className="flex items-center gap-2">
                        <Twitter className="w-4 h-4 text-[#0A66C2]" />
                        <strong>Twitter:</strong>{" "}
                        <a
                            href={company.twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {company.twitterUrl.replace(
                                "https://twitter.com/",
                                ""
                            )}
                        </a>
                    </p>
                )}

                {company.mapEmbedUrl && (
                    <>
                        <div className="flex items-center gap-2 mt-4">
                            <Map className="w-4 h-4 text-[#0A66C2]" />
                            <strong>View on Map</strong>
                        </div>
                        <iframe
                            width="100%"
                            height="250"
                            style={{ border: 0, marginTop: "8px" }}
                            src={company.mapEmbedUrl}
                            allowFullScreen
                            title="Google Maps"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default MyCompanyContactInfo;

// "use client";

// import React from "react";
// import useMyCompanyStore from "../store/myCompanyStore";
// import { MapPin, Phone, Mail, Globe, Link as LinkIcon } from "lucide-react";

// const MyCompanyContactInfo = () => {
//     const { company } = useMyCompanyStore();

//     if (!company) return null;

//     return (
//         <div className="p-6 bg-white rounded-lg shadow-xl">
//             <h2 className="px-4 py-2 text-lg font-semibold text-white rounded bg-[#0A66C2]">
//                 Contact Information
//             </h2>

//             <div className="mt-4 space-y-4">
//                 <div className="flex items-center p-3 rounded-lg bg-gray-50">
//                     <MapPin className="w-5 h-5 mr-3 text-blue-600" />
//                     <div>
//                         <h3 className="text-sm font-medium text-gray-700">Address</h3>
//                         <p className="text-gray-600">
//                             {company.address}, {company.locationCity}, {company.locationCountry}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="flex items-center p-3 rounded-lg bg-gray-50">
//                     <Mail className="w-5 h-5 mr-3 text-blue-600" />
//                     <div>
//                         <h3 className="text-sm font-medium text-gray-700">Email</h3>
//                         <p className="text-blue-600">{company.email}</p>
//                     </div>
//                 </div>

//                 <div className="flex items-center p-3 rounded-lg bg-gray-50">
//                     <Phone className="w-5 h-5 mr-3 text-blue-600" />
//                     <div>
//                         <h3 className="text-sm font-medium text-gray-700">Phone</h3>
//                         <p className="text-gray-600">{company.phoneNumber}</p>
//                     </div>
//                 </div>

//                 {company.website && (
//                     <div className="flex items-center p-3 rounded-lg bg-gray-50">
//                         <Globe className="w-5 h-5 mr-3 text-blue-600" />
//                         <div>
//                             <h3 className="text-sm font-medium text-gray-700">Website</h3>
//                             <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                                 {company.website.replace(/^https?:\/\//, '')}
//                             </a>
//                         </div>
//                     </div>
//                 )}

//                 {/* Social Media Links */}
//                 {(company.facebookUrl || company.twitterUrl || company.linkedinUrl) && (
//                     <div className="mt-6">
//                         <h3 className="mb-3 text-sm font-medium text-gray-700">Social Media</h3>
//                         <div className="flex flex-wrap gap-3">
//                             {company.facebookUrl && (
//                                 <a href={company.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
//                                     <LinkIcon className="w-4 h-4 mr-2" />
//                                     Facebook
//                                 </a>
//                             )}

//                             {company.twitterUrl && (
//                                 <a href={company.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
//                                     <LinkIcon className="w-4 h-4 mr-2" />
//                                     Twitter
//                                 </a>
//                             )}

//                             {company.linkedinUrl && (
//                                 <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
//                                     <LinkIcon className="w-4 h-4 mr-2" />
//                                     LinkedIn
//                                 </a>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {/* Map Embed */}
//                 {company.mapEmbedUrl && (
//                     <div className="mt-6">
//                         <h3 className="mb-3 text-sm font-medium text-gray-700">Location Map</h3>
//                         <div className="overflow-hidden rounded-lg aspect-video">
//                             <iframe
//                                 src={company.mapEmbedUrl}
//                                 width="100%"
//                                 height="100%"
//                                 style={{border: 0}}
//                                 allowFullScreen=""
//                                 loading="lazy"
//                                 referrerPolicy="no-referrer-when-downgrade"
//                             ></iframe>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default MyCompanyContactInfo;
