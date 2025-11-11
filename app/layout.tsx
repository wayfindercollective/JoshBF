import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Purpose Transformation Blueprint | Josh Terry",
  description: "8-week guided digital system to uncover purpose and direction. Black Friday special: $297 one-time payment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

