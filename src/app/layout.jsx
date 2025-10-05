import "@/styles/globals.css";
import "flag-icons/css/flag-icons.min.css"; 
import ClientRootLayout from "./ClientRootLayout";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL('https://jobhuntly.io.vn'),
  title: {
    default: 'JobHuntly — Find quality jobs fast',
    template: '%s | JobHuntly'
  },
  description: 'JobHuntly connects candidates and employers with fast, reliable hiring.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'JobHuntly',
    url: 'https://jobhuntly.io.vn',
    title: 'JobHuntly — Find quality jobs fast',
    description: 'JobHuntly connects candidates and employers with fast, reliable hiring.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobHuntly — Find quality jobs fast',
    description: 'JobHuntly connects candidates and employers with fast, reliable hiring.'
  },
  alternates: { canonical: 'https://jobhuntly.io.vn' },
  
  icons: {
    icon: '/logo.svg',
  }
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
