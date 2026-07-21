import { useQuery } from '@tanstack/react-query';
import { rewardsService } from '@/services/rewards.service';
import { useAuthStore } from '@/store/AuthStore';
import { useSettings } from './useSettings';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';

export const useRewards = () => {
  const { user, isAuthenticated } = useAuthStore();
  const organization = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  
  const { data: settings } = useSettings(organization?._id || '', selectedOutlet?._id || '');

  const showRewards = settings?.checkOutSettings?.showRewards ?? false;

  const balanceQuery = useQuery({
    queryKey: ['rewards-balance', user?._id],
    queryFn: () => rewardsService.getBalance(user!._id!),
    enabled: isAuthenticated && !!user?._id && showRewards,
    staleTime: 5 * 60 * 1000,
  });

  const transactionsQuery = useQuery({
    queryKey: ['rewards-transactions', user?._id],
    queryFn: () => rewardsService.getTransactions(user!._id!),
    enabled: isAuthenticated && !!user?._id && showRewards,
    staleTime: 5 * 60 * 1000,
  });

  const rulesQuery = useQuery({
    queryKey: ['rewards-rules'],
    queryFn: () => rewardsService.getRules(),
    enabled: isAuthenticated && showRewards,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    balance: balanceQuery.data,
    transactions: transactionsQuery.data,
    rules: rulesQuery.data,
    isLoading: balanceQuery.isLoading || transactionsQuery.isLoading || rulesQuery.isLoading,
    isError: balanceQuery.isError || transactionsQuery.isError || rulesQuery.isError,
    refetch: () => {
      balanceQuery.refetch();
      transactionsQuery.refetch();
      rulesQuery.refetch();
    },
  };
};
