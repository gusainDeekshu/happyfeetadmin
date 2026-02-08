import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import api from '@/services/api';

/* ============================
   Types
============================ */

export type InquiryStatus = 'Pending' | 'Contacted' | 'Completed';

export interface Inquiry {
  subscribe: any;
  updatedAt: string | number | Date;
  budget: string;
  projectType: string;
  lastName: string;
  firstName: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    hasMore: boolean;
    total?: number;
  };
}

/* ============================
   Queries
============================ */

// ✅ Simple fetch (non-paginated)
export const useInquiries = () => {
  return useQuery<Inquiry[]>({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const { data } = await api.get('/inquiries');
      return data;
    },
  });
};

// ✅ Infinite pagination with search + status
export const useInquiriesInfinite = (
  search: string,
  status: InquiryStatus | 'All'
) => {
  return useInfiniteQuery<PaginatedResponse<Inquiry>>({
    queryKey: ['inquiries', search, status],
    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get('/inquiries', {
        params: {
          page: pageParam,
          limit: 15,
          search: search || undefined,
          status: status === 'All' ? undefined : status,
        },
      });

      return data;
    },

    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined,
  });
};

/* ============================
   Mutations
============================ */

export const useUpdateInquiryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: InquiryStatus;
    }) => {
      const { data } = await api.put(`/inquiries/${id}`, { status });
      return data;
    },

    onSuccess: () => {
      // Refresh both normal & infinite lists
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
};
