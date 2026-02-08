import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const api = axios.create({
  baseURL:process.env.NEXT_PUBLIC_API_BASE_URL, // Your Node Backend URL
});
interface ToggleFeaturedArgs {
  id: string;
  type: 'products' | 'services' | 'categories';
  isFeatured: boolean;
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, type, isFeatured }: ToggleFeaturedArgs) => {
      const { data } = await api.patch(
        `/content/${type}/${id}/featured`,
        { isFeatured }
      );

      return data;
    },

    onSuccess: (_data, variables) => {
      // refresh corresponding list
      queryClient.invalidateQueries({
        queryKey: [variables.type],
      });
    },
  });
}
