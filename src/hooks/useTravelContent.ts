// src/hooks/useTravelContent.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useTravelContent = (type: 'packages' | 'gallery' | 'services') => {
  const queryClient = useQueryClient();
  
  // Mapping to match frontend fetch keys
  const queryKeyMap = {
    packages: 'product-pages',
    gallery: 'gallery',
    services: 'service-page'
  };

  const queryKey = [queryKeyMap[type]];

  // 1. Define hooks at the top level
  const fetchAll = useQuery({
    queryKey: queryKey,
    queryFn: async () => (await api.get(`/content/${type}`)).data,
  });

  const create = useMutation({
    mutationFn: async (data: any) => await api.post(`/content/${type}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => await api.delete(`/content/${type}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => 
      await api.put(`/content/${type}/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  // 2. Return them as an object
  return { fetchAll, create, remove, update };
};