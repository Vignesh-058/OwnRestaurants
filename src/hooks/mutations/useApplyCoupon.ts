import { useMutation, useQueryClient } from '@tanstack/react-query';
import { couponService } from '@/services/coupon.service';
import { useCouponStore } from '@/store/CouponStore';
import { useCartStore } from '@/store/CartStore';
import { useOutletStore } from '@/store/OutletStore';
import { toast } from 'sonner';
import type { ApplyCouponPayload } from '@/types/coupon.types';

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();
  const { setAppliedCoupon } = useCouponStore();
  const { orderId } = useCartStore();
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

 return useMutation({
 mutationFn: async (code: string) => {
 if (!orderId || !selectedOutlet?._id) {
 throw new Error('Cart or outlet not available.');
 }

 const payload: ApplyCouponPayload = {
 outletId: selectedOutlet._id,
 orderId,
 code: code.trim(),
 };

 return { result: await couponService.applyToCart(payload), code };
 },
 onSuccess: ({ result, code }) => {
 const discount = result.discountAmount ?? result.discount ?? result.savings ?? 0;
 const total = result.grandTotal ?? result.total ?? null;
 
 // We don't have the full coupon object here, so we simulate it with code for state compatibility
 const pseudoCoupon = { _id: code, code, discountType: 'Fixed', discountValue: discount } as any;
 setAppliedCoupon(pseudoCoupon, code, discount, total);

 // Invalidate the cart so prices refresh
 queryClient.invalidateQueries({ queryKey: ['cart'] });
 },
 onError: (error: any) => {
 const msg: string = error?.response?.data?.message ?? error?.message ?? 'Failed to apply coupon.';

 // Handle session expiry
 if (msg.toLowerCase().includes('session expired') || msg.toLowerCase().includes('invalid token') || error?.response?.status === 401) {
 toast.error('Session expired. Please log in again.');
 setTimeout(() => { window.location.href = '/login'; }, 1500);
 return;
 }

 const friendlyMap: Record<string, string> = {
 'invalid coupon': 'This coupon code is invalid.',
 'expired': 'This coupon has expired.',
 'already used': 'You have already used this coupon.',
 'minimum': `Minimum order amount not reached.`,
 'not applicable': 'This coupon is not applicable to your cart.',
 };

 const friendly = Object.entries(friendlyMap).find(([k]) => msg.toLowerCase().includes(k))?.[1] ?? msg;
 toast.error(friendly);
 },
 });
};
