import React from 'react';

export const metadata = {
  title: "Company Details | JobHuntly",
  description: "Detailed information about the company and job opportunities",
};
export default function CompanyDetailLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
} 