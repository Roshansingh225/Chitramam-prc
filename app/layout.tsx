import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAIL PRC Automation",
  description: "Price Reasonability Committee document generation"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
