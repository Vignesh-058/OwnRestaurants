import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateCart } from '@/hooks/queries/useCart';
import { useOutletStore } from '@/store/OutletStore';
import { useAuthStore } from '@/store/AuthStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import type { Order } from '@/types/order.types';
import type { CartCreateRequest, CartItemRequest } from '@/types/cart.types';

export const useRepeatOrder = () => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);

  const { mutateAsync: createCart } = useCreateCart();
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const setSelectedOutlet = useOutletStore((state) => state.setSelectedOutlet);
  const user = useAuthStore((state) => state.user);
  const organization = useOrganizationStore((state) => state.organization);

  const formatCartPayload = (order: Order, targetOutletId: string): CartCreateRequest => {
    console.log('[Items to Reorder]', order.items);
    
    const items: CartItemRequest[] = (order.items || []).map((item) => {
      // Safely map Addon format
      let formattedAddOns: any[] = [];
      const sourceAddons = item.addOnDetails || item.addons || [];
      
      // Some backends return simple arrays, some nested objects. 
      // Mapping safely to Cart API expected format: group_id, addon_item_ids
      if (sourceAddons.length > 0) {
         // Assuming basic structure if backend directly gave them. Otherwise just pass empty or exact mapped if group exists.
         // Actually, if we just stringify or use exact IDs if we have them:
         // The prompt says: "Preserve: itemId, variationId, addonIds, quantity, special instructions, outletId".
         formattedAddOns = sourceAddons.map((a: any) => ({
           group_id: a.group_id || a.groupId || '',
           addon_item_ids: a.addon_item_ids || (a._id ? [a._id] : []),
         })).filter((a: any) => a.group_id || a.addon_item_ids.length > 0);
      }

      return {
        itemId: item.itemid || item._id || '',
        quantity: item.quantity,
        variationId: item.variationId || (item as any).variation_id || '',
        addOnDetails: formattedAddOns,
        currency: organization?.currency || 'INR',
      };
    });

    return {
      items,
      deliveryType: order.orderType === 'Self Pickup' ? 'takeaway' : 'delivery',
      orderType: order.orderType || 'Door Delivery',
      customerName: order.customerName || user?.name || '',
      customerPhoneNo: order.customerPhone || user?.phone || '',
      instruction: order.instructions || '',
      outletId: targetOutletId,
    };
  };

  const processReorder = async (order: Order, outletId: string) => {
    try {
      setIsPending(true);
      
      const payload = formatCartPayload(order, outletId);
      
      console.log('[Cart API Request]', payload);
      
      const response = await createCart(payload);
      
      console.log('[Cart API Response]', response);
      console.log('[Success]', 'Order replicated to cart successfully.');
      
      toast.success('Items added to cart successfully.');
      navigate('/cart');
      
    } catch (error: any) {
      console.error('[Error] Failed to repeat order:', error);
      // The useCreateCart hook handles specific toast errors like 'item not found'.
    } finally {
      setIsPending(false);
      setShowConfirmDialog(false);
      setPendingOrder(null);
    }
  };

  const handleRepeatOrder = (order: Order) => {
    if (!order.items || order.items.length === 0) {
      toast.error('No items found in this order to repeat.');
      return;
    }

    console.log('[Selected Order]', order);
    console.log('[Order ID]', order.orderId || order._id);
    console.log('[Outlet ID]', order.outletId);

    const targetOutletId = order.outletId;
    const currentOutletId = selectedOutlet?._id;

    if (targetOutletId && currentOutletId && targetOutletId !== currentOutletId) {
      setPendingOrder(order);
      setShowConfirmDialog(true);
      return;
    }

    // Process immediately if outlet matches or is missing
    processReorder(order, targetOutletId || currentOutletId || '');
  };

  const confirmReorder = () => {
    if (pendingOrder && pendingOrder.outletId) {
      // Find the outlet from the global store if needed, or simply override ID.
      // But typically setSelectedOutlet takes the full object. 
      // If we don't have the full object, we set partial.
      setSelectedOutlet({ _id: pendingOrder.outletId } as any);
      processReorder(pendingOrder, pendingOrder.outletId);
    }
  };

  const cancelReorder = () => {
    setShowConfirmDialog(false);
    setPendingOrder(null);
  };

  return {
    handleRepeatOrder,
    isPending,
    showConfirmDialog,
    confirmReorder,
    cancelReorder,
  };
};
