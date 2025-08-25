import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trevvos",
  description: "Portal Trevvos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
