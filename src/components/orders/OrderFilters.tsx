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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
          <Input
            placeholder="Search by order ID, name or phone..."
            className="pl-11 rounded-xl h-11 bg-white border-[#FFE2CC] shadow-sm focus-visible:ring-1 focus-visible:ring-[#FF6B00] focus-visible:border-[#FF6B00]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <div className="h-11 w-11 rounded-xl bg-white border border-[#FFE2CC] shadow-sm flex items-center justify-center shrink-0">
            <SlidersHorizontal className="h-4 w-4 text-[#6B7280]" />
          </div>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-[160px] rounded-xl h-11 bg-white border-[#FFE2CC] shadow-sm focus:ring-1 focus:ring-[#FF6B00] font-medium text-[#1F2937]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="newest" className="rounded-lg my-1 cursor-pointer hover:bg-[#FFF4EB]">Newest First</SelectItem>
              <SelectItem value="oldest" className="rounded-lg my-1 cursor-pointer hover:bg-[#FFF4EB]">Oldest First</SelectItem>
              <SelectItem value="highest" className="rounded-lg my-1 cursor-pointer hover:bg-[#FFF4EB]">Highest Amount</SelectItem>
              <SelectItem value="lowest" className="rounded-lg my-1 cursor-pointer hover:bg-[#FFF4EB]">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={filters.status} onValueChange={(v: string) => setFilters({ status: v as any })}>
          <SelectTrigger className="w-auto min-w-[130px] rounded-xl h-11 bg-white text-[14px] border-[#FFE2CC] shadow-sm focus:ring-1 focus:ring-[#FF6B00] font-medium text-[#1F2937]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s} className="rounded-lg my-0.5 cursor-pointer hover:bg-[#FFF4EB]">{s === 'All' ? 'All Statuses' : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.payment} onValueChange={(v: string) => setFilters({ payment: v as any })}>
          <SelectTrigger className="w-auto min-w-[130px] rounded-xl h-11 bg-white text-[14px] border-[#FFE2CC] shadow-sm focus:ring-1 focus:ring-[#FF6B00] font-medium text-[#1F2937]">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {PAYMENT_OPTIONS.map((p) => (
              <SelectItem key={p} value={p} className="rounded-lg my-0.5 cursor-pointer hover:bg-[#FFF4EB]">{p === 'All' ? 'All Payments' : p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.orderType} onValueChange={(v: string) => setFilters({ orderType: v as any })}>
          <SelectTrigger className="w-auto min-w-[130px] rounded-xl h-11 bg-white text-[14px] border-[#FFE2CC] shadow-sm focus:ring-1 focus:ring-[#FF6B00] font-medium text-[#1F2937]">
            <SelectValue placeholder="Order Type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {TYPE_OPTIONS.map((t) => (
              <SelectItem key={t} value={t} className="rounded-lg my-0.5 cursor-pointer hover:bg-[#FFF4EB]">{t === 'All' ? 'All Types' : t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
