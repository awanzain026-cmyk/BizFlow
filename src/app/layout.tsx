import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "BizFlow — AI Business Suite for Pakistani Entrepreneurs",
  description: "Generate invoices, track payments, manage clients and get AI insights — all in one place. Built for Pakistani small businesses.",
  keywords: "invoice, business management, Pakistan, AI, small business",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
