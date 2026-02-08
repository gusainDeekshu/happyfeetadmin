// src/hooks/useContent.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useContent = (type: 'projects' | 'products' | 'services') => {
  const queryClient = useQueryClient();
  const queryKey = [type];

  const fetchAll = useQuery({
    queryKey,
    queryFn: async () => (await api.get(`/content/${type}`)).data,
  });

  const create = useMutation({
    mutationFn: async (newData: any) => await api.post(`/content/${type}`, newData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => 
      await api.put(`/content/${type}/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => await api.delete(`/content/${type}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { fetchAll, create, update, remove };
};