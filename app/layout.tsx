import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import QueryProvider from "@/lib/queryProvider";
import { ContextProvider } from "@/contextProvider";
import AuthGaurd from "@/lib/authGaurd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Heroes | Golf Scores, Monthly Draws & Charity Impact",
  description: "Digital Heroes combines golf performance tracking, monthly prize draws, and charitable giving. Track your Stableford scores, compete for prizes, and support the cause you believe in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
  <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white overflow-x-hidden`}
        >
        <ContextProvider>
        <QueryProvider>
        <AuthGaurd>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID||''}>
            {children}
             </GoogleOAuthProvider>
  <ToastContainer
  position="bottom-right"
  autoClose={3000}
  hideProgressBar={false}
  closeOnClick
  pauseOnHover
  toastStyle={{
    fontFamily: "'Syne', sans-serif",
    fontSize: "13px",
    letterSpacing: "1px",
    color: "#0a0a0a",
    background: "#ffffff",
    border: "1.5px solid white",
  }}
  style={{ "--toastify-color-progress-light": "#0a0a0a" } as React.CSSProperties}
/>
</AuthGaurd>
     </QueryProvider>
     </ContextProvider>

      </body>
    </html>
  );
}
