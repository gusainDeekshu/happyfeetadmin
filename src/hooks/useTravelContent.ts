import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useTravelContent = (type: 'packages' | 'gallery' | 'services') => {
  const queryClient = useQueryClient();
  
  // Keep your existing query key mapping
  const queryKeyMap = {
    packages: 'product-pages',
    gallery: 'gallery',
    services: 'service-page'
  };

  const queryKey = [queryKeyMap[type]];

  // Determine the correct base URL based on the type
  // 'packages' routes are at /api/packages, others are at /api/content/
  const getBaseUrl = (type: string) => type === 'packages' ? `/${type}` : `/content/${type}`;

  const fetchAll = useQuery({
    queryKey: queryKey,
    queryFn: async () => (await api.get(getBaseUrl(type))).data,
  });

  const create = useMutation({
    mutationFn: async (data: any) => await api.post(getBaseUrl(type), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => await api.delete(`${getBaseUrl(type)}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => 
      await api.put(`${getBaseUrl(type)}/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { fetchAll, create, remove, update };
};