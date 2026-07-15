import { Input } from '@/components/ui/input';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from '@/components/ui/select';
import { useOrderStore } from '@/store/OrderStore';

const STATUS_OPTIONS = ['All', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Out For Delivery', 'Delivered', 'Cancelled'];
const PAYMENT_OPTIONS = ['All', 'COD', 'Online', 'Card', 'UPI'];
const TYPE_OPTIONS = ['All', 'Door Delivery', 'Self Pickup', 'Dine In'];

interface OrderFiltersProps {
 onSortChange: (sort: string) => void;
 sort: string;
}

export const OrderFilters = ({ onSortChange, sort }: OrderFiltersProps) => {
 const { searchQuery, setSearchQuery, filters, setFilters } = useOrderStore();

 return (
 <div className="space-y-3">
 {/* Search row */}
 <div className="flex flex-col sm:flex-row gap-3">
 <div className="relative flex-1">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
 <Input
 placeholder="Search by order ID, name or phone..."
 className="pl-11 rounded-[12px] h-11 bg-white border-[#E5E7EB] shadow-sm focus-visible:ring-1 focus-visible:ring-[#FF6B00] focus-visible:border-[#FF6B00]"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 {searchQuery && (
 <button
 onClick={() => setSearchQuery('')}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827]"
 >
 <X className="h-4 w-4" />
 </button>
 )}
 </div>

 {/* Sort */}
 <div className="flex items-center gap-2">
 <div className="h-11 w-11 rounded-[12px] bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center shrink-0">
 <SlidersHorizontal className="h-4 w-4 text-[#6B7280]" />
 </div>
 <Select value={sort} onValueChange={onSortChange}>
 <SelectTrigger className="w-[160px] rounded-[12px] h-11 bg-white border-[#E5E7EB] shadow-sm focus:ring-1 focus:ring-[#FF6B00] font-medium text-[#111827]">
 <SelectValue placeholder="Sort by" />
 </SelectTrigger>
 <SelectContent className="rounded-[12px]">
 <SelectItem value="newest" className="rounded-lg my-1 cursor-pointer hover:bg-[#F9FAFB]">Newest First</SelectItem>
 <SelectItem value="oldest" className="rounded-lg my-1 cursor-pointer hover:bg-[#F9FAFB]">Oldest First</SelectItem>
 <SelectItem value="highest" className="rounded-lg my-1 cursor-pointer hover:bg-[#F9FAFB]">Highest Amount</SelectItem>
 <SelectItem value="lowest" className="rounded-lg my-1 cursor-pointer hover:bg-[#F9FAFB]">Lowest Amount</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>

 {/* Filter row */}
 <div className="flex flex-wrap gap-3 items-center">
 <Select value={filters.status} onValueChange={(v: string) => setFilters({ status: v as any })}>
 <SelectTrigger className="w-auto min-w-[130px] rounded-[12px] h-11 bg-white text-[14px] border-[#E5E7EB] shadow-sm focus:ring-1 focus:ring-[#FF6B00] font-medium text-[#111827]">
 <SelectValue placeholder="Status" />
 </SelectTrigger>
 <SelectContent className="rounded-[12px]">
 {STATUS_OPTIONS.map((s) => (
 <SelectItem key={s} value={s} className="rounded-lg my-0.5 cursor-pointer hover:bg-[#F9FAFB]">{s === 'All' ? 'All Statuses' : s}</SelectItem>
 ))}
 </SelectContent>
 </Select>

 <Select value={filters.payment} onValueChange={(v: string) => setFilters({ payment: v as any })}>
 <SelectTrigger className="w-auto min-w-[130px] rounded-[12px] h-11 bg-white text-[14px] border-[#E5E7EB] shadow-sm focus:ring-1 focus:ring-[#FF6B00] font-medium text-[#111827]">
 <SelectValue placeholder="Payment" />
 </SelectTrigger>
 <SelectContent className="rounded-[12px]">
 {PAYMENT_OPTIONS.map((p) => (
 <SelectItem key={p} value={p} className="rounded-lg my-0.5 cursor-pointer hover:bg-[#F9FAFB]">{p === 'All' ? 'All Payments' : p}</SelectItem>
 ))}
 </SelectContent>
 </Select>

 <Select value={filters.orderType} onValueChange={(v: string) => setFilters({ orderType: v as any })}>
 <SelectTrigger className="w-auto min-w-[130px] rounded-[12px] h-11 bg-white text-[14px] border-[#E5E7EB] shadow-sm focus:ring-1 focus:ring-[#FF6B00] font-medium text-[#111827]">
 <SelectValue placeholder="Order Type" />
 </SelectTrigger>
 <SelectContent className="rounded-[12px]">
 {TYPE_OPTIONS.map((t) => (
 <SelectItem key={t} value={t} className="rounded-lg my-0.5 cursor-pointer hover:bg-[#F9FAFB]">{t === 'All' ? 'All Types' : t}</SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 </div>
 );
};
