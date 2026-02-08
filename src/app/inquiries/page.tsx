'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Eye,
  Search,
  Filter,
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  useInquiriesInfinite,
  useUpdateInquiryStatus,
  Inquiry,
} from '@/hooks/useInquiries';

/* ---------------- TYPES ---------------- */

export type InquiryStatus = 'Pending' | 'Contacted' | 'Completed';

/* ---------------- COMPONENT ---------------- */

export default function InquiriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'All'>('All');

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInquiriesInfinite(debouncedSearch, statusFilter);

  const updateMutation = useUpdateInquiryStatus();

  /* -------- infinite scroll observer -------- */
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  /* ---------------- DATA NORMALIZATION ---------------- */

  const inquiries: Inquiry[] = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.data ?? []);
  }, [data]);

  /* ---------------- FILTERING ---------------- */

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      if (
        debouncedSearch &&
        !`${item.firstName} ${item.lastName} ${item.email}`
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      ) {
        return false;
      }

      if (statusFilter !== 'All' && item.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [inquiries, debouncedSearch, statusFilter]);

  /* ---------------- HELPERS ---------------- */

  const getNextStatus = (current: InquiryStatus): InquiryStatus => {
    if (current === 'Pending') return 'Contacted';
    if (current === 'Contacted') return 'Completed';
    return 'Pending';
  };

  const onStatusBadgeClick = (
    e: React.MouseEvent,
    id: string,
    currentStatus: InquiryStatus
  ) => {
    e.stopPropagation();
    const next = getNextStatus(currentStatus);
    updateMutation.mutate({ id, status: next });

    if (selectedInquiry?._id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: next });
    }
  };

  const openDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <AlertCircle className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case 'Contacted':
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <Clock className="w-3 h-3 mr-1" /> Contacted
          </Badge>
        );
      case 'Completed':
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </Badge>
        );
    }
  };

  if (isError) {
    return (
      <div className="p-8 text-red-500">
        Failed to load inquiries.
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inquiries</h1>
          <p className="text-muted-foreground text-sm">
            Manage incoming client requests
          </p>
        </div>

        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 w-[260px]"
              placeholder="Search name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as InquiryStatus | 'All')
            }
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredInquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No inquiries found.
                </TableCell>
              </TableRow>
            ) : (
              filteredInquiries.map((item) => (
                <TableRow key={item._id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="font-medium">
                      {item.firstName} {item.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.email}
                    </div>
                  </TableCell>

                  <TableCell className="max-w-md truncate">
                    {item.message}
                  </TableCell>

                  <TableCell>
                    <div
                      className="cursor-pointer inline-block"
                      onClick={(e) =>
                        onStatusBadgeClick(e, item._id, item.status)
                      }
                    >
                      {getStatusBadge(item.status)}
                    </div>
                  </TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openDetails(item)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    

                    <Button size="icon" variant="ghost" asChild>
                      <a href={`mailto:${item.email}`}>
                        <Mail className="w-4 h-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}

            {isFetchingNextPage && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div ref={ref} className="h-4 w-full" />
      </div>

      {/* MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Inquiry Details</DialogTitle>
            <DialogDescription>
              Reference ID: <span className="font-mono text-xs">{selectedInquiry?._id}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-6">
              {/* 1. STATUS BAR */}
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border">
                <span className="text-sm font-medium text-muted-foreground">Current Status</span>
                <div
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() =>
                    updateMutation.mutate({
                      id: selectedInquiry._id,
                      status: getNextStatus(selectedInquiry.status),
                    })
                  }
                >
                  {getStatusBadge(selectedInquiry.status)}
                </div>
              </div>

              {/* 2. PERSONAL DETAILS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 border p-4 rounded-lg">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Full Name</h4>
                  <p className="text-sm font-medium">{selectedInquiry.firstName} {selectedInquiry.lastName}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Email Address</h4>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-sm text-blue-600 hover:underline break-all">
                    {selectedInquiry.email}
                  </a>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Phone Number</h4>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-sm text-blue-600 hover:underline">
                    {selectedInquiry.phone}
                  </a>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Newsletter Sub</h4>
                  <p className="text-sm">
                    {selectedInquiry.subscribe ? (
                      <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Subscribed</span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </p>
                </div>
              </div>

              {/* 3. PROJECT DETAILS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 border p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Project Type</h4>
                  <p className="text-sm font-medium">{selectedInquiry.projectType || 'Not specified'}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Budget Estimate</h4>
                  <p className="text-sm font-medium">{selectedInquiry.budget || 'Not specified'}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Submitted On</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedInquiry.createdAt).toLocaleString(undefined, {
                      dateStyle: 'full',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Last Updated</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedInquiry.updatedAt).toLocaleString(undefined, {
                       dateStyle: 'medium', 
                       timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>

              {/* 4. MESSAGE AREA */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground">Message Content</h4>
                <div className="bg-muted p-4 rounded-md text-sm leading-relaxed whitespace-pre-wrap border">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            {selectedInquiry && (
              <Button asChild>
                <a href={`mailto:${selectedInquiry.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Reply via Email
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- UTIL ---------------- */

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
