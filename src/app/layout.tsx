// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AdminLayout from "./admin/AdminLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hercules Admin Panel",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Wrap everything inside Providers */}
        <QueryProvider>
          <AdminLayout>
            {children}
          </AdminLayout>
        </QueryProvider>
      </body>
    </html>
  );
}