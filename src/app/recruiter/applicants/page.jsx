"use client";

import { redirect } from "next/navigation";

export default function ApplicantsIndex() {
	redirect("/recruiter/applicants/all");
	return null;
} 