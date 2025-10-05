import CandidateSidebar from "@/app/(user)/components/CandidateSidebar";

export default function CandidateLayout({ children }) {
  return (
      <div className="flex min-h-screen mx-auto max-w-7xl">
          <aside className="w-[280px] shrink-0 hidden sticky top-24 h-fit max-h-[calc(100vh-2rem)] lg:block">
              <CandidateSidebar />
          </aside>
          <main className="flex-1 min-h-screen px-6">{children}</main>
          {/* Pattern decorations
          <div className="absolute left-0 w-40 h-40 -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full top-24 opacity-20"></div>
          <div className="absolute bottom-0 right-[0] w-50 h-50 bg-blue-500 rounded-full opacity-20 translate-x-1/3 translate-y-1/3"></div> */}
      </div>
  );
}
