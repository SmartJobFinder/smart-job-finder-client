import "@/styles/globals.css";
import "flag-icons/css/flag-icons.min.css";
import ClientRootLayout from "./ClientRootLayout";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://jobfind.io.vn"),
  title: {
    default: "JobFind — Find quality jobs fast",
    template: "%s | JobFind",
  },
  description:
    "JobFind connects candidates and employers with fast, reliable hiring.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "JobFind",
    url: "https://jobfind.io.vn",
    title: "JobFind — Find quality jobs fast",
    description:
      "JobFind connects candidates and employers with fast, reliable hiring.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobFind — Find quality jobs fast",
    description:
      "JobFind connects candidates and employers with fast, reliable hiring.",
  },
  alternates: { canonical: "https://jobfind.io.vn" },

  icons: {
    icon: "/logo.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body data-scrolling-animations="true">
        <div className="sp-body">
          <ClientRootLayout>{children}</ClientRootLayout>
        </div>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
