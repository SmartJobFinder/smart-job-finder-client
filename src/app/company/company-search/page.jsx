"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Import động các components phía client
const SearchPageContent = dynamic(() => import('./pages/SearchPageContent'));

export default function CompanySearchPage() {
  return <SearchPageContent />;
} 