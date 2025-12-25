import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Christmas quiz 2024",
  description: "Family Christmas dinner quiz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
