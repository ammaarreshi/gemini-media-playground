import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gemini AI Playground",
  description: "Generate and edit images using Google's Gemini 2.0 Flash API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
