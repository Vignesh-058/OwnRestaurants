import { useState, useMemo } from 'react';
import type { CustomerAddress } from '@/types/customer.types';
import { AddressCard } from './AddressCard';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
 } from "@/components/ui/select";
import { useAddressStore } from '@/store/AddressStore';


interface AddressListProps {
  addresses: CustomerAddress[];
}

type SortOption = 'newest' | 'oldest' | 'recently_used' | 'city';

export const AddressList = ({ addresses }: AddressListProps) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [sortBy, setSortBy] = useState<SortOption>('newest');
 const setDeliveryAddress = useAddressStore((state) => state.setDeliveryAddress);

 const handleUseForDelivery = (address: CustomerAddress) => {
 setDeliveryAddress(address);
 };

 const filteredAndSortedAddresses = useMemo(() => {
 let result = [...addresses];

 // Search
 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase();
 result = result.filter(a => 
 a.city.toLowerCase().includes(q) || 
 a.pincode.toLowerCase().includes(q) || 
 a.address1.toLowerCase().includes(q) || 
 a.customerName.toLowerCase().includes(q)
 );
 }

 // Sort
 result.sort((a, b) => {
 switch (sortBy) {
 case 'newest':
 return (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0);
 case 'oldest':
 return (a.createdAt ? new Date(a.createdAt).getTime() : 0) - (b.createdAt ? new Date(b.createdAt).getTime() : 0);
 case 'recently_used':
 return (b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0) - (a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0);
 case 'city':
 return a.city.localeCompare(b.city);
 default:
 return 0;
 }
 });

 // Always put default address first if not actively searching
 if (!searchQuery.trim()) {
 result.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
 }

 return result;
 }, [addresses, searchQuery, sortBy]);

 return (
 <div className="flex flex-col space-y-6">
 {/* Search and Filter Bar */}
 <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl shadow-sm border">
 <div className="relative w-full sm:max-w-md">
 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
 <Search className="h-5 w-5 text-muted-foreground" />
 </div>
 <Input
 type="text"
 placeholder="Search by city, pincode, or name..."
 className="pl-11 rounded-full bg-background border-transparent focus-visible:ring-1 h-12"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>

 <div className="flex items-center gap-2 w-full sm:w-auto">
 <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shrink-0">
 <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
 </div>
 <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as SortOption)}>
 <SelectTrigger className="w-full sm:w-[180px] rounded-full h-12 border-transparent bg-background">
 <SelectValue placeholder="Sort by" />
 </SelectTrigger>
 <SelectContent className="rounded-2xl">
 <SelectItem value="newest" className="rounded-xl my-1">Newest First</SelectItem>
 <SelectItem value="oldest" className="rounded-xl my-1">Oldest First</SelectItem>
 <SelectItem value="recently_used" className="rounded-xl my-1">Recently Used</SelectItem>
 <SelectItem value="city" className="rounded-xl my-1">City (A-Z)</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>

 {/* Grid */}
 {filteredAndSortedAddresses.length === 0 ? (
 <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-3xl">
 No addresses match your search criteria.
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
 {filteredAndSortedAddresses.map(address => (
 <AddressCard 
 key={address._id} 
 address={address} 
 onUseForDelivery={handleUseForDelivery} 
 />
 ))}
 </div>
 )}
 </div>
 );
};
