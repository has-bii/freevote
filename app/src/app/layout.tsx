import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-image-crop/dist/ReactCrop.css";
import RootProvider from "@/providers/root-provider";
import { ProgressBar, ProgressBarProvider } from "react-transition-progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Vote - Create and Participate in Easy, Secure Online Voting",
  description:
    "Free Vote allows users to create and participate in online voting sessions effortlessly. Whether you're organizing a poll or casting your vote, Free Vote provides a simple, free, and secure platform to express your opinions and make decisions. Join open voting sessions or create your own with customizable options to engage your community or team. Try Free Vote today for a seamless voting experience!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgressBarProvider>
          <ProgressBar className="fixed top-0 z-50 h-1 bg-black" />
          <RootProvider>{children}</RootProvider>
        </ProgressBarProvider>
      </body>
    </html>
  );
}
