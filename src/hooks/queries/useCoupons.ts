import { useQuery } from '@tanstack/react-query';
import { couponService } from '@/services/coupon.service';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { useAuthStore } from '@/store/AuthStore';

export const useCoupons = () => {
 const { isAuthenticated } = useAuthStore();
 const organization = useOrganizationStore((state) => state.organization);
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

 return useQuery({
 queryKey: ['coupons', organization?._id, selectedOutlet?._id],
 queryFn: () => couponService.getUserDiscounts(selectedOutlet!._id),
 enabled: isAuthenticated && !!organization?._id && useOutletStore.getState().storeStatus?.storeStatus === true,
 staleTime: 5 * 60 * 1000,
 retry: 1,
 });
};
