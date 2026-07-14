import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import { useOrders } from '@/hooks/queries/useOrders';
import { useOrderStore } from '@/store/OrderStore';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderDetailsDialog } from '@/components/orders/OrderDetailsDialog';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { OrderSkeleton } from '@/components/orders/OrderSkeleton';
import { EmptyOrders } from '@/components/orders/EmptyOrders';
import { Pagination } from '@/components/orders/Pagination';
import { Button } from '@/components/ui/button';
import { RefreshCw, Package, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Order } from '@/types/order.types';

export const OrdersPage = () => {
 const navigate = useNavigate();
 const { isAuthenticated } = useAuthStore();
 const { data, isLoading, isError, refetch } = useOrders();
 const { orders, pagination, loading, error, selectedOrder, setSelectedOrder, filters, searchQuery } = useOrderStore();
 const [dialogOpen, setDialogOpen] = useState(false);
 const [sort, setSort] = useState('newest');

 useEffect(() => {
 window.scrollTo(0, 0);
 }, []);

 const handleViewDetails = (order: Order) => {
 setSelectedOrder(order);
 setDialogOpen(true);
 };

 const handleCloseDialog = () => {
 setDialogOpen(false);
 setTimeout(() => setSelectedOrder(null), 300);
 };

 // Client-side filter + search + sort on current page results
 const processedOrders = useMemo(() => {
 let result = [...(orders ?? [])];

 // Search
 if (searchQuery) {
 const q = searchQuery.toLowerCase();
 result = result.filter((o) =>
 o._id.toLowerCase().includes(q) ||
 o.orderNo?.toLowerCase().includes(q) ||
 o.orderId?.toLowerCase().includes(q) ||
 o.customerName?.toLowerCase().includes(q) ||
 o.customerPhone?.toLowerCase().includes(q) ||
 o.phone?.toLowerCase().includes(q)
 );
 }

 // Status filter
 if (filters.status !== 'All') {
 result = result.filter((o) => o.status === filters.status);
 }

 // Payment filter
 if (filters.payment !== 'All') {
 result = result.filter((o) => o.paymentMode === filters.payment);
 }

 // Order type filter
 if (filters.orderType !== 'All') {
 result = result.filter((o) => o.orderType === filters.orderType);
 }

 // Sort
 result.sort((a, b) => {
 switch (sort) {
 case 'oldest':
 return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
 case 'highest':
 return (b.grandTotal ?? 0) - (a.grandTotal ?? 0);
 case 'lowest':
 return (a.grandTotal ?? 0) - (b.grandTotal ?? 0);
 default: // newest
 return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
 }
 });

 return result;
 }, [orders, searchQuery, filters, sort]);

 if (!isAuthenticated) {
 navigate('/login', { replace: true });
 return null;
 }

 const renderContent = () => {
 if (loading) return <OrderSkeleton />;

 if (error) {
 return (
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="min-h-[45vh] flex flex-col items-center justify-center p-8 border border-red-500/20 dark:border-red-500/10 rounded-[2rem] bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl shadow-lg gap-4"
 >
 <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
 <AlertCircle className="h-7 w-7" />
 </div>
 <div>
 <h2 className="text-xl font-black text-foreground">Couldn't load orders</h2>
 <p className="text-muted-foreground text-sm mt-1">{error}</p>
 </div>
 <Button onClick={() => refetch()} className="rounded-full shadow-premium gap-2 px-6 h-11 font-black text-xs">
 <RefreshCw className="h-4 w-4" />
 Try Again
 </Button>
 </motion.div>
 );
 }

 if (!orders?.length) return <EmptyOrders />;

 if (processedOrders.length === 0) {
 return (
 <div className="py-20 text-center border border-border/80 dark:border-white/10 rounded-[2rem] text-muted-foreground bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl">
 No orders match your current filters.
 </div>
 );
 }

 return (
 <div className="space-y-4">
 {processedOrders.map((order) => (
 <OrderCard key={order._id} order={order} onViewDetails={handleViewDetails} />
 ))}
 {pagination && (
 <Pagination
 totalPages={pagination.totalPages}
 hasNextPage={pagination.hasNextPage}
 hasPrevPage={pagination.hasPrevPage}
 totalOrders={pagination.totalOrders}
 />
 )}
 </div>
 );
 };

 return (
 <div className="bg-background min-h-screen py-10">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

 {/* Main Content */}
 <motion.div 
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="flex-1 min-w-0 space-y-6"
 >
 {/* Page header */}
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 sm:p-8 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-border relative overflow-hidden">
 
 <div className="flex items-center gap-4 relative z-10">
 <div className="h-14 w-14 rounded-2xl bg-[#FFF3E8] text-primary flex items-center justify-center">
 <Package className="h-7 w-7" />
 </div>
 <div>
 <h1 className="text-2xl font-bold tracking-tight text-foreground">Order History</h1>
 <p className="text-muted-foreground text-sm font-normal mt-1">
 {data?.totalOrders
 ? `Review and track your ${data.totalOrders} past order${data.totalOrders > 1 ? 's' : ''}`
 : 'Track and view your past orders'}
 </p>
 </div>
 </div>
 <Button
 variant="outline"
 className="rounded-full gap-2 px-5 h-10 bg-white border-primary text-primary hover:bg-primary hover:text-white transition-all hover:-translate-y-[1px] font-bold text-xs shadow-sm shrink-0"
 onClick={() => refetch()}
 disabled={isLoading}
 >
 <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
 Refresh
 </Button>
 </div>

 {/* Filters */}
 {!isLoading && !isError && (
 <div className="mb-6">
 <OrderFilters sort={sort} onSortChange={setSort} />
 </div>
 )}

 {/* Orders list */}
 <div className="relative">
 <AnimatePresence mode="wait">
 {renderContent()}
 </AnimatePresence>
 </div>
 </motion.div>
 </div>

 {/* Order Details Dialog */}
 <OrderDetailsDialog
 order={selectedOrder}
 open={dialogOpen}
 onClose={handleCloseDialog}
 />
 </div>
 );
};
