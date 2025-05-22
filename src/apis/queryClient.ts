import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (_error, query) => {
      toast.error((query.meta?.errorMessage as string) || 'Lấy dữ liệu không thành công');
    },
  }),
});