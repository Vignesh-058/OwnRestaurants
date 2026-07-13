import { useState, useMemo } from 'react';
import type { CategoryItem } from '@/types/category.types';

export type SortOption = 'popularity' | 'price-low' | 'price-high' | 'newest' | 'rating';
export type FoodType = 'all' | 'veg' | 'non-veg';

export const useProductFilters = (items: CategoryItem[]) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [offers, setOffers] = useState<string[]>([]);
  const [ratings, setRatings] = useState<number[]>([]);
  const [foodType, setFoodType] = useState<FoodType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setOffers([]);
    setRatings([]);
    setFoodType('all');
    setSortBy('popularity');
    setInStockOnly(false);
    setSearchQuery('');
  };

  const filteredItems = useMemo(() => {
    let result = [...items].filter(Boolean); // Filter out null or undefined items

    // 1. Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name?.toLowerCase().includes(query) || 
        item.description?.toLowerCase().includes(query)
      );
    }

    // 2. Price Range
    result = result.filter(item => {
      const price = Number(item.defaultSellingPrice || item.sellingPrice || item.price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // 3. Food Type
    if (foodType !== 'all') {
      result = result.filter(item => {
        const type = item.dietryType?.toLowerCase();
        if (foodType === 'veg') return type === 'veg' || type === 'vegan';
        if (foodType === 'non-veg') return type === 'non-veg';
        return true;
      });
    }

    // 4. In Stock Only
    if (inStockOnly) {
      result = result.filter(item => item.inStock !== false);
    }

    // 5. Customer Ratings (OR logic if multiple selected)
    if (ratings.length > 0) {
      const minSelectedRating = Math.min(...ratings);
      result = result.filter(item => {
        const rating = item.rating || (Math.random() * 2 + 3); // Dummy rating fallback if API doesn't have it, normally item.rating
        return rating >= minSelectedRating;
      });
    }

    // 6. Offers (OR logic)
    if (offers.length > 0) {
      result = result.filter(item => {
        const price = Number(item.defaultSellingPrice || item.sellingPrice || 0);
        const originalPrice = Number(item.defaultBasePrice || item.basePrice || price);
        const isDiscounted = originalPrice > price;
        const tags = item.tag?.map(t => t.toLowerCase()) || [];

        // Check if item matches at least one selected offer
        if (offers.includes('Discounted Products') && isDiscounted) return true;
        if (offers.includes('Today\'s Deals') && tags.includes('deal')) return true;
        if (offers.includes('Free Delivery') && tags.includes('free-delivery')) return true;
        if (offers.includes('Buy 1 Get 1') && tags.includes('bogo')) return true;
        if (offers.includes('Cashback Offers') && tags.includes('cashback')) return true;

        // If offers are selected but item doesn't match any, filter it out
        return false;
      });
    }

    // 7. Sorting
    result.sort((a, b) => {
      const priceA = Number(a.defaultSellingPrice || a.sellingPrice || a.price || 0);
      const priceB = Number(b.defaultSellingPrice || b.sellingPrice || b.price || 0);
      
      switch (sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'rating': {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        }
        case 'newest': {
          const idA = a._id || '';
          const idB = b._id || '';
          return idA.localeCompare(idB) * -1; // Newest first based on Mongo ID
        }
        case 'popularity':
        default: {
          const bestSellerA = a.bestseller ? 1 : 0;
          const bestSellerB = b.bestseller ? 1 : 0;
          return bestSellerB - bestSellerA;
        }
      }
    });

    return result;
  }, [items, priceRange, offers, ratings, foodType, sortBy, inStockOnly, searchQuery]);

  return {
    priceRange, setPriceRange,
    offers, setOffers,
    ratings, setRatings,
    foodType, setFoodType,
    sortBy, setSortBy,
    inStockOnly, setInStockOnly,
    searchQuery, setSearchQuery,
    filteredItems,
    resetFilters
  };
};
