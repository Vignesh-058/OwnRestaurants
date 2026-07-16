import { useMemo } from 'react';
import type { CategoryItem } from '@/types/category.types';

export interface FilterOptions {
  categories: string[];
  foodType: string;
  priceRange: [number, number];
  rating: number;
  offers: string[];
  availability: string[];
  sortBy: string;
}

export function useProductFilter(items: CategoryItem[] | undefined, filters: FilterOptions) {
  return useMemo(() => {
    if (!items || items.length === 0) return [];
    
    let filtered = items;

    // Categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(item => filters.categories.includes(item.category));
    }

    // Food Type
    if (filters.foodType === "veg") {
      filtered = filtered.filter(
        (item) =>
          item.dietryType?.toLowerCase() === "veg" ||
          item.dietryType?.toLowerCase() === "vegan" ||
          item.type?.toLowerCase() === "veg"
      );
    } else if (filters.foodType === "non-veg") {
      filtered = filtered.filter(
        (item) =>
          item.dietryType?.toLowerCase() === "non-veg" ||
          item.dietryType?.toLowerCase() === "non veg" ||
          item.type?.toLowerCase() === "non-veg"
      );
    }

    // Price
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) {
      filtered = filtered.filter((item) => {
        const price = item.sellingPrice || item.basePrice || 0;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Rating
    if (filters.rating > 0) {
      filtered = filtered.filter((item) => (item.rating || 0) >= filters.rating);
    }

    // Offers
    if (filters.offers.length > 0) {
      filtered = filtered.filter((item) => {
        let hasOffer = false;
        if (
          filters.offers.includes("discount") &&
          ((item.discount?.value?.amount || 0) > 0 ||
            (item.discount?.value?.getDiscountPercent || 0) > 0)
        )
          hasOffer = true;
        if (filters.offers.includes("free-delivery") && item.sellingPrice > 500)
          hasOffer = true;
        if (
          filters.offers.includes("combo") &&
          (item.name || "").toLowerCase().includes("combo")
        )
          hasOffer = true;
        if (
          filters.offers.includes("bogo") &&
          (item.name || "").toLowerCase().includes("bogo")
        )
          hasOffer = true;
        return hasOffer;
      });
    }

    // Availability
    if (filters.availability.length > 0) {
      filtered = filtered.filter((item) => {
        if (filters.availability.includes("out-of-stock")) return !item.inStock;
        if (filters.availability.includes("available")) return item.inStock !== false;
        return true;
      });
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      const priceA = a.sellingPrice || a.basePrice || 0;
      const priceB = b.sellingPrice || b.basePrice || 0;
      switch (filters.sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "best-selling":
          return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, filters]);
}
