import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useOrderStore } from '@/store/OrderStore';

interface PaginationProps {
 totalPages?: number;
 hasNextPage?: boolean;
 hasPrevPage?: boolean;
 totalOrders?: number;
}

export const Pagination = ({ totalPages, hasNextPage, hasPrevPage, totalOrders }: PaginationProps) => {
 const { currentPage, pageSize, setCurrentPage } = useOrderStore();

 if (!totalPages || totalPages <= 1) return null;

 const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
 const half = 2;
 const start = Math.max(1, Math.min(currentPage - half, totalPages - 4));
 return start + i;
 }).filter((p) => p >= 1 && p <= totalPages);

 const from = (currentPage - 1) * pageSize + 1;
 const to = Math.min(currentPage * pageSize, totalOrders ?? currentPage * pageSize);

 return (
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
 <p className="text-sm text-muted-foreground">
 Showing <span className="font-semibold text-foreground">{from}–{to}</span>
 {totalOrders ? <> of <span className="font-semibold text-foreground">{totalOrders}</span> orders</> : ''}
 </p>

 <div className="flex items-center gap-2">
 <Button
 variant="outline"
 size="sm"
 className="rounded-full gap-1.5"
 disabled={!hasPrevPage && currentPage <= 1}
 onClick={() => setCurrentPage(currentPage - 1)}
 >
 <ChevronLeft className="h-4 w-4" />
 Previous
 </Button>

 {pages.map((page) => (
 <Button
 key={page}
 variant={page === currentPage ? 'default' : 'outline'}
 size="sm"
 className="rounded-full w-9 h-9"
 onClick={() => setCurrentPage(page)}
 >
 {page}
 </Button>
 ))}

 <Button
 variant="outline"
 size="sm"
 className="rounded-full gap-1.5"
 disabled={!hasNextPage && currentPage >= (totalPages ?? 1)}
 onClick={() => setCurrentPage(currentPage + 1)}
 >
 Next
 <ChevronRight className="h-4 w-4" />
 </Button>
 </div>
 </div>
 );
};
