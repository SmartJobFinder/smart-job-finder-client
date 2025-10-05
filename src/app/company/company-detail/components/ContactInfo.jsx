"use client";

import React from "react";
import useCompanyDetailStore from "../store/companyDetailStore";
import { MapPin, Mail, Phone, Globe, Facebook, Linkedin, Twitter, Map } from "lucide-react";
import { t } from "@/i18n/i18n";

const ContactInfo = () => {
    const { company } = useCompanyDetailStore();

    if (!company) return null;

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl">
            <h2 className="px-4 py-2 text-lg font-semibold text-white bg-blue-700 rounded">
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

                <div className="flex items-center gap-2 mt-4">
                    <Map className="w-4 h-4 text-[#0A66C2]" />
                    <strong>View map</strong>
                </div>
            </div>
            <iframe
                width="100%"
                height="250"
                style={{ border: 0, marginTop: "8px" }}
                src={
                    company.mapEmbedUrl ||
                    `https://www.google.com/maps/embed/v1/place?key=AIzaSyCVgO8KzHQ8iKcfqXgrMnUIGlD-piWiPpo&q=${encodeURIComponent(
                        company.address +
                            ", " +
                            company.locationCity +
                            ", " +
                            company.locationCountry
                    )}&zoom=15&language=vi`
                }
                allowFullScreen
                title="Google Maps"
            />
        </div>
    );
};

export default ContactInfo;
