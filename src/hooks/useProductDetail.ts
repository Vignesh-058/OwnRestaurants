import { useState, useEffect, useMemo, useCallback } from 'react';
import { useItemDetail } from '@/hooks/queries/useItemDetail';

export const useProductDetail = (itemId: string | null, isOpen: boolean) => {
 const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
 const [selectedAddons, setSelectedAddons] = useState<Record<string, string[]>>({});
 const [quantity, setQuantity] = useState(1);

 // Fetch product data
 const { data: item, isLoading, isError } = useItemDetail(itemId, selectedVariation || undefined);

 // Reset state when drawer opens or changes item
 useEffect(() => {
 if (isOpen) {
 setSelectedVariation(null);
 setSelectedAddons({});
 setQuantity(1);
 }
 }, [isOpen, itemId]);

 // Set default variation if available and not selected
 useEffect(() => {
 if (item?.variations?.length && !selectedVariation) {
 setSelectedVariation(item.variations[0].variationid);
 }
 }, [item, selectedVariation]);

 // Calculations
 const basePrice = item ? (item.sellingPrice || item.basePrice || 0) : 0;
 
 const addonsPrice = useMemo(() => {
 if (!item?.addons) return 0;
 let total = 0;
 Object.entries(selectedAddons).forEach(([groupId, itemIds]) => {
 const group = item.addons.find(g => g.addongroupid === groupId);
 if (group) {
 itemIds.forEach(id => {
 const addonItem = group.items.find(i => i.addonitemid === id);
 if (addonItem) total += (addonItem.addonitem_price || 0);
 });
 }
 });
 return total;
 }, [selectedAddons, item]);

 const totalPrice = (basePrice + addonsPrice) * quantity;

 // Handlers
 const handleAddonChange = useCallback((groupId: string, addonId: string, checked: boolean, max: number) => {
 setSelectedAddons(prev => {
 const current = prev[groupId] || [];
 if (checked) {
 if (max === 1) {
 return { ...prev, [groupId]: [addonId] };
 }
 if (current.length < max) {
 return { ...prev, [groupId]: [...current, addonId] };
 }
 return prev;
 } else {
 return { ...prev, [groupId]: current.filter(id => id !== addonId) };
 }
 });
 }, []);

 const isValid = useMemo(() => {
 if (!item) return false;
 if (item.variations?.length > 0 && !selectedVariation) return false;
 if (!item.stockStatus) return false;
 
 // Check addon constraints
 if (item.addons) {
 for (const group of item.addons) {
 const selectedCount = (selectedAddons[group.addongroupid] || []).length;
 if (selectedCount < group.min || (group.max > 0 && selectedCount > group.max)) {
 return false;
 }
 }
 }
 return true;
 }, [item, selectedVariation, selectedAddons]);

 return {
 item,
 isLoading,
 isError,
 selectedVariation,
 setSelectedVariation,
 selectedAddons,
 handleAddonChange,
 quantity,
 setQuantity,
 basePrice,
 addonsPrice,
 totalPrice,
 isValid
 };
};
