import CandidateLayout from "@/app/(user)/components/CandidateLayout";
export const metadata = { robots: { index: false, follow: false } };
export default function Layout({ children }) {
  return <CandidateLayout>{children}</CandidateLayout>;
}