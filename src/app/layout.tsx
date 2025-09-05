import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";

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
        <SiteHeader />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
