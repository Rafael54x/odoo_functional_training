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
  title: "Odoo Functional Lab — Silabus Odoo 19",
  description:
    "Silabus praktikum Odoo 19 Functional dari setup master data hingga flow Purchase, Inventory, Sales, dan Invoicing.",
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
          Odoo Functional Lab · Database latihan <code>odoo_functional</code> ·
          Modul standar Odoo 19
        </footer>
      </body>
    </html>
  );
}
