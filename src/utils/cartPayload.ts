import { useLocationStore } from '@/store/LocationStore';
import { useCartStore } from '@/store/CartStore';

/**
 * Validates if a string is a 24-character MongoDB ObjectId.
 */
export const isValidMongoId = (id: string | null | undefined): boolean => {
  if (!id) return false;
  return /^[a-fA-F0-9]{24}$/.test(id);
};

/**
 * Determines the correct address payload to send to cart/create or cart/update.
 * Rules:
 * 1. Never send `mock-address-id`, `null`, `undefined`, or `""`.
 * 2. ONLY send `addressId` if it is a valid Mongo ObjectId.
 */
export const getCartAddressPayload = () => {
  const locStore = useLocationStore.getState();
  const cartStore = useCartStore.getState();
  const currentAddressId = locStore.addressId || cartStore.addressId;

  if (isValidMongoId(currentAddressId)) {
    return { addressId: currentAddressId };
  }

  // Strictly do NOT send any invalid addressId.
  return {};
};

/**
 * Validates whether the user has provided a valid saved address
 * to proceed with a 'Door Delivery' order.
 */
export const hasValidDeliveryAddress = (): boolean => {
  const locStore = useLocationStore.getState();
  const cartStore = useCartStore.getState();
  const currentAddressId = locStore.addressId || cartStore.addressId;

  // Enforce that a valid MongoID is strictly required for Delivery
  return isValidMongoId(currentAddressId);
};
