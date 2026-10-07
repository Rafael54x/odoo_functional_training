import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const heading = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Odoo Functional Lab — Belajar Odoo 19 dari Nol",
  description:
    "Panduan Odoo 19 Functional ramah pemula: dari login dan master data sampai Purchase, Inventory, Sales, dan Accounting.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${sans.variable} ${heading.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-teal-900/10 px-4 py-6 text-center text-xs text-stone-500 sm:px-6">
          Odoo Functional Lab ·{" "}
          <a
            href="http://172.16.2.123:8072"
            className="text-teal-800 hover:underline"
          >
            172.16.2.123:8072
          </a>{" "}
          · DB <code>odoo</code> · Odoo 19 Enterprise
        </footer>
      </body>
    </html>
  );
}
