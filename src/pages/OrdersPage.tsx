import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import { useOrders } from '@/hooks/queries/useOrders';
import { useOrderStore } from '@/store/OrderStore';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { OrderSkeleton } from '@/components/orders/OrderSkeleton';
import { EmptyOrders } from '@/components/orders/EmptyOrders';
import { Pagination } from '@/components/orders/Pagination';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Order } from '@/types/order.types';

export const OrdersPage = () => {
 const navigate = useNavigate();
 const { isAuthenticated } = useAuthStore();
 const { isLoading, isError, refetch } = useOrders();
 const { orders, pagination, loading, error, filters, searchQuery } = useOrderStore();
 const [sort, setSort] = useState('newest');

 useEffect(() => {
 window.scrollTo(0, 0);
 }, []);

 const handleViewDetails = (order: Order) => {
 navigate(`/orders/${order.orderId || order._id}`, { state: { order } });
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
  className="min-h-[45vh] flex flex-col items-center justify-center p-8 border border-[#FFE2CC] rounded-2xl bg-[#FFFFFF] shadow-sm gap-4 text-center"
  >
  <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
  <AlertCircle className="h-10 w-10 text-red-500" />
  </div>
  <div>
  <h2 className="text-[24px] font-bold text-[#1F2937] tracking-tight">Couldn't load orders</h2>
  <p className="text-[#6B7280] text-[14px] mt-2 max-w-sm">Unable to load your orders. Please try again.</p>
  </div>
  <Button onClick={() => refetch()} className="rounded-xl mt-4 bg-[#FF6B00] hover:bg-[#FF7A1A] text-white px-8 h-11 font-bold">
  <RefreshCw className="h-4 w-4 mr-2" />
  Try Again
  </Button>
  </motion.div>
  );
 }

 if (!orders?.length) return <EmptyOrders />;

 if (processedOrders.length === 0) {
  return (
  <div className="py-20 flex flex-col items-center justify-center text-center border border-[#FFE2CC] rounded-2xl bg-[#FFFFFF] shadow-sm">
  <Package className="h-12 w-12 text-gray-300 mb-4" />
  <h3 className="text-xl font-bold text-[#1F2937]">No matches found</h3>
  <p className="text-[#6B7280] mt-1">No orders match your current filters or search.</p>
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
  <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-32">
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

  {/* Main Content */}
  <motion.div 
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="flex-1 min-w-0 space-y-6"
  >
  {/* Page header */}
  <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#FFE2CC]">
  <div>
  <h1 className="text-[24px] font-bold text-[#1F2937] leading-none tracking-tight mb-2">Order History</h1>
  <p className="text-[#6B7280] text-[14px] font-normal">
  View and track all your previous orders.
  </p>
  </div>
  <Button
  variant="outline"
  className="w-10 h-10 rounded-full p-0 bg-white border-[#FFE2CC] text-[#1F2937] hover:bg-[#FFF4EB] hover:text-[#FF6B00] hover:border-[#FF6B00]/30 transition-all shadow-sm shrink-0"
  onClick={() => refetch()}
  disabled={isLoading}
  >
  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
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

 </div>
 );
};
