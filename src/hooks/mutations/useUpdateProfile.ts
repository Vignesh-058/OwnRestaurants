import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customer.service';
import { useAuthStore } from '@/store/AuthStore';
import { toast } from 'sonner';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { id: string; payload: Partial<any> }) => {
      return await customerService.updateProfile(data.id, data.payload);
    },
    onSuccess: (updatedProfile, variables) => {
      // Mocking the update in AuthStore since we don't have a GET profile endpoint locally to refetch
      updateUser(variables.payload);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    },
  });
};
