import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserDiscounts, applyDiscountToCart } from '@/services/discount.service';
import { useOutletStore } from '@/store/OutletStore';
import { useAuthStore } from '@/store/AuthStore';
import { toast } from 'sonner';
import { useCartStore } from '@/store/CartStore';

export const useDiscounts = () => {
  const queryClient = useQueryClient();
  const outletId = useOutletStore((state) => state.selectedOutlet?._id);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const orderId = useCartStore((state) => state.orderId);

  // ---- Fetch Available Offers (React Query v5 syntax) ----
  const {
    data: offers,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['discounts', outletId],
    queryFn: () => getUserDiscounts(outletId!),
    enabled: isAuthenticated && !!outletId,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,
  });

  // ---- Apply Selected Offer (React Query v5 syntax) ----
  const applyMutation = useMutation({
    mutationFn: applyDiscountToCart,
    onSuccess: (res) => {
      console.log('[Discount] Updated Grand Total', res?.cart?.grandTotal || res?.grandTotal);
      // Refresh cart & order summary after discount applied
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      // Refresh discounts if backend changes eligibility after applying
      queryClient.invalidateQueries({ queryKey: ['discounts', outletId] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to apply offer.';
      toast.error(msg);
      console.error('[Discount] Apply error', err);
    },
  });

  const applyOffer = (offerId: string) => {
    if (!outletId || !orderId) {
      toast.error('Cart not found. Please add items to cart first.');
      return;
    }

    const offer = offers?.find((o: any) => o._id === offerId);

    const payload = {
      outletId,
      orderId,
      discountId: offerId,
      code: offer?.code || '',
    };

    console.log('[Discount] Selected Discount', offerId);
    applyMutation.mutate(payload);
  };

  return {
    offers,
    isLoading,
    isError,
    refetch,
    applyOffer,
    applying: applyMutation.isPending,
    appliedOfferId: applyMutation.data?.appliedOfferId,
  };
};
