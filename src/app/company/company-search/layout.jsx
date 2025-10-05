import React from 'react';

export const metadata = {
  title: 'Tìm kiếm công ty | JobHuntly',
  description: 'Tìm kiếm công ty phù hợp với sở thích và kỹ năng của bạn',
};

export default function CompanySearchLayout({ children }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 