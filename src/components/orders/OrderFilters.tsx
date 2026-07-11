import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
 const { searchQuery, setSearchQuery, filters, setFilters, resetFilters } = useOrderStore();
 const hasActiveFilters =
 searchQuery || filters.status !== 'All' || filters.payment !== 'All' || filters.orderType !== 'All';

 return (
 <div className="space-y-4">
 {/* Search row */}
 <div className="flex flex-col sm:flex-row gap-3">
 <div className="relative flex-1">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
 <Input
 placeholder="Search by order ID, name or phone..."
 className="pl-11 rounded-full h-12 bg-white border-transparent focus-visible:ring-1"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 {searchQuery && (
 <button
 onClick={() => setSearchQuery('')}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
 >
 <X className="h-4 w-4" />
 </button>
 )}
 </div>

 {/* Sort */}
 <div className="flex items-center gap-2">
 <div className="h-12 w-12 rounded-full bg-white border flex items-center justify-center shrink-0">
 <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
 </div>
 <Select value={sort} onValueChange={onSortChange}>
 <SelectTrigger className="w-[170px] rounded-full h-12 bg-white border-transparent">
 <SelectValue placeholder="Sort by" />
 </SelectTrigger>
 <SelectContent className="rounded-2xl">
 <SelectItem value="newest" className="rounded-xl my-1">Newest First</SelectItem>
 <SelectItem value="oldest" className="rounded-xl my-1">Oldest First</SelectItem>
 <SelectItem value="highest" className="rounded-xl my-1">Highest Amount</SelectItem>
 <SelectItem value="lowest" className="rounded-xl my-1">Lowest Amount</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>

 {/* Filter row */}
 <div className="flex flex-wrap gap-3 items-center">
 <Select value={filters.status} onValueChange={(v: string) => setFilters({ status: v as any })}>
 <SelectTrigger className="w-auto min-w-[130px] rounded-full h-10 bg-white text-sm border-transparent">
 <SelectValue placeholder="Status" />
 </SelectTrigger>
 <SelectContent className="rounded-2xl">
 {STATUS_OPTIONS.map((s) => (
 <SelectItem key={s} value={s} className="rounded-xl my-0.5">{s === 'All' ? 'All Statuses' : s}</SelectItem>
 ))}
 </SelectContent>
 </Select>

 <Select value={filters.payment} onValueChange={(v: string) => setFilters({ payment: v as any })}>
 <SelectTrigger className="w-auto min-w-[140px] rounded-full h-10 bg-white text-sm border-transparent">
 <SelectValue placeholder="Payment" />
 </SelectTrigger>
 <SelectContent className="rounded-2xl">
 {PAYMENT_OPTIONS.map((p) => (
 <SelectItem key={p} value={p} className="rounded-xl my-0.5">{p === 'All' ? 'All Payments' : p}</SelectItem>
 ))}
 </SelectContent>
 </Select>

 <Select value={filters.orderType} onValueChange={(v: string) => setFilters({ orderType: v as any })}>
 <SelectTrigger className="w-auto min-w-[140px] rounded-full h-10 bg-white text-sm border-transparent">
 <SelectValue placeholder="Order Type" />
 </SelectTrigger>
 <SelectContent className="rounded-2xl">
 {TYPE_OPTIONS.map((t) => (
 <SelectItem key={t} value={t} className="rounded-xl my-0.5">{t === 'All' ? 'All Types' : t}</SelectItem>
 ))}
 </SelectContent>
 </Select>

 {hasActiveFilters && (
 <Button variant="ghost" className="rounded-full h-10 text-sm text-muted-foreground hover:text-foreground gap-2" onClick={resetFilters}>
 <X className="h-3.5 w-3.5" /> Clear All
 </Button>
 )}
 </div>
 </div>
 );
};
