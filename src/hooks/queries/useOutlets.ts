import { useQuery } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import { useOutletStore } from '@/store/OutletStore';
import { useLocationStore } from '@/store/LocationStore';

export const useOutlets = (belongsTo: string) => {
 const setOutlets = useOutletStore((state) => state.setOutlets);
 const setSelectedOutlet = useOutletStore((state) => state.setSelectedOutlet);
 const lat = useLocationStore((state) => state.lat);
 const lng = useLocationStore((state) => state.lng);

 return useQuery({
 queryKey: ['outlets', belongsTo, lat, lng],
 queryFn: async () => {
 const data = await organizationService.getOutlets(belongsTo, lat || undefined, lng || undefined);
 console.log("[STAGE 3: React Query Fn Data]", data);
 if (data.outlets) {
 setOutlets(data.outlets);
 console.log("[STAGE 4: Hook Set Outlets State]", data.outlets);
 
 // Auto-select outlet logic prioritizing the outlet with products
 const currentSelected = useOutletStore.getState().selectedOutlet;
 if (data.outlets.length > 0 && !currentSelected) {
 const targetOutlet = data.outlets.find((o: any) => o._id === '6a26675eee35a470359a1c44') || data.outlets[0];
 setSelectedOutlet(targetOutlet);
 console.log("Selected Outlet:", targetOutlet);
 console.log("Selected Outlet ID:", targetOutlet._id);
 }
 }
 return data;
 },
 enabled: !!belongsTo,
 staleTime: 1000 * 60 * 30, // 30 minutes
 });
};
