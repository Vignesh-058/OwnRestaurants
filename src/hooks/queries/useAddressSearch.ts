import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/location.service';
import { useOrganizationStore } from '@/store/OrganizationStore';

// Custom hook for debouncing input values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useAddressSearch = (queryText: string) => {
  const belongsTo = useOrganizationStore((state) => state.organization?._id);
  const debouncedQuery = useDebounce(queryText, 400);

  return useQuery({
    queryKey: ['addressSearch', debouncedQuery, belongsTo],
    queryFn: async () => {
      if (!belongsTo || debouncedQuery.length < 3) return null;
      
      const data = await locationService.getCustomerLatLng({
        enteredAddress: debouncedQuery,
        belongsTo,
      });
      return data;
    },
    // Only fire API if we have a query of at least 3 chars
    enabled: !!belongsTo && debouncedQuery.length >= 3,
    staleTime: 1000 * 60 * 5, // Cache search results for 5 minutes
  });
};
