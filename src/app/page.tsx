'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContent } from '@/hooks/useContent';
import { useInquiries, Inquiry } from '@/hooks/useInquiries';
import { Loader2, Package, Wrench, FolderKanban, MessageSquare } from 'lucide-react';

/* ---------------------------------------------
   Helper type guards
--------------------------------------------- */

type InfiniteInquiryData = {
  pages: { data: Inquiry[] }[];
};

function isInfiniteData(
  data: unknown
): data is InfiniteInquiryData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'pages' in data &&
    Array.isArray((data ).pages)
  );
}

export default function DashboardPage() {
  const products = useContent('products');
  const services = useContent('services');
  const projects = useContent('projects');

  const inquiriesQuery = useInquiries();

  const isLoading =
    products.fetchAll.isLoading ||
    services.fetchAll.isLoading ||
    projects.fetchAll.isLoading ||
    inquiriesQuery.isLoading;

  /* ---------------------------------------------
     SAFE + TYPE-CORRECT FLATTEN
  --------------------------------------------- */
const inquiries: Inquiry[] = useMemo(() => {
  const data = inquiriesQuery.data;
  if (!data) return [];

  // Infinite query
  if (isInfiniteData(data)) {
    return data.pages.flatMap(page =>
      Array.isArray(page.data) ? page.data : []
    );
  }

  // Normal array
  if (Array.isArray(data)) {
    return data;
  }

  // Object with data field
  if (typeof data === 'object' && data !== null && 'data' in data) {
    return Array.isArray((data as any).data) ? (data as any).data : [];
  }

  return [];
}, [inquiriesQuery.data]);

  /* ---------------------------------------------
     STATS
  --------------------------------------------- */
  const pendingInquiries = useMemo(() => {
  return inquiries.filter(i =>
    String(i.status).toLowerCase() === 'pending'
  ).length;
}, [inquiries]);


  const stats = [
    {
      title: "Active Products",
      value: products.fetchAll.data?.length ?? 0,
      icon: Package,
      desc: "Product pages live",
      color: "text-blue-600",
    },
    {
      title: "Service Offerings",
      value: services.fetchAll.data?.length ?? 0,
      icon: Wrench,
      desc: "Services pages live",
      color: "text-purple-600",
    },
    {
      title: "Projects Showcase",
      value: projects.fetchAll.data?.length ?? 0,
      icon: FolderKanban,
      desc: "Portfolio items",
      color: "text-green-600",
    },
    {
      title: "Pending Inquiries",
      value: pendingInquiries,
      icon: MessageSquare,
      desc: "Requires attention",
      color: "text-orange-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <Loader2 className="animate-spin text-blue-900 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0f2a55]">Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Welcome back to the Hercules Admin Panel.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0f2a55]">
                {stat.value}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {stat.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System status */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#0f2a55]">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
              <span className="text-sm font-medium text-green-800">
                API Connection
              </span>
              <span className="text-xs font-bold text-green-700">
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
              <span className="text-sm font-medium text-blue-800">
                Database
              </span>
              <span className="text-xs font-bold text-blue-700">
                Connected
              </span>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
