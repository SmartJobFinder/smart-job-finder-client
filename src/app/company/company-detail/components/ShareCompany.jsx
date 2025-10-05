"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import useCompanyDetailStore from '../store/companyDetailStore';
import { t } from "@/i18n/i18n";

const ShareCompany = () => {
  const { company } = useCompanyDetailStore();
  const [copied, setCopied] = useState(false);
  
  if (!company) return null;

  const companyUrl = typeof window !== 'undefined' ? 
    `${window.location.origin}/company/company-detail/${company.id}` : 
    '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(companyUrl);
    setCopied(true);
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
      <div className="p-6 bg-white rounded-lg shadow-xl">
          <h2 className="px-4 py-2 text-lg font-semibold text-white bg-blue-700 rounded">
              {t`Share company with friends`}
          </h2>
          <p className="mt-4 mb-2 text-sm font-medium">Copy link</p>

          <div
              onClick={handleCopyLink}
              className="relative w-full p-4 overflow-hidden border border-blue-700 rounded-lg cursor-pointer"
          >
              <h3 className="text-sm font-semibold truncate whitespace-nowrap overflow-hidden text-[#1F2937]">
                  {companyUrl}
              </h3>

              {copied && (
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-blue-700 bg-opacity-90">
                      Copied!
                  </div>
              )}
          </div>

          <p className="mt-4 text-sm font-medium">{t`Share on social media`}</p>
          <div className="flex gap-3 mt-2">
              <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      companyUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <Image
                      src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/share/facebook.png"
                      alt="Facebook"
                      width={32}
                      height={32}
                  />
              </a>
              <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      companyUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <Image
                      src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/share/twitter.png"
                      alt="Twitter"
                      width={32}
                      height={32}
                  />
              </a>
              <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      companyUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <Image
                      src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/share/linked.png"
                      alt="LinkedIn"
                      width={32}
                      height={32}
                  />
              </a>
          </div>
      </div>
  );
};

export default ShareCompany; 