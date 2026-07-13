import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, ChevronRight } from 'lucide-react';
import { useRecentOrders } from '@/hooks/queries/useRecentOrders';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { EmptyOrders } from './EmptyOrders';

export const RecentOrders = () => {
 const { data: ordersData, isLoading } = useRecentOrders();
 const orders = ordersData?.data ?? [];
 const currency = useOrganizationStore((state) => state.organization?.currency || '₹');

 const getStatusColor = (status: string) => {
 switch (status.toLowerCase()) {
 case 'delivered': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
 case 'processing': return 'bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/20';
 case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
 default: return 'bg-secondary text-secondary-foreground border-border';
 }
 };

 if (isLoading) return null;

 return (
 <Card className="rounded-3xl border-border/50 shadow-sm bg-card overflow-hidden">
 <CardHeader className="bg-muted/30 pb-4 border-b border-border/50 px-6 sm:px-8 pt-8 flex flex-row items-center justify-between">
 <div>
 <CardTitle className="text-[28px] font-bold text-foreground">Recent Orders</CardTitle>
 <p className="text-sm font-medium text-muted-foreground mt-1">Your latest purchases</p>
 </div>
 {orders && orders.length > 0 && (
 <Button variant="ghost" className="hidden sm:flex text-primary font-bold hover:bg-primary/10 rounded-full" asChild>
 <Link to="/profile/orders">View All</Link>
 </Button>
 )}
 </CardHeader>
 
 <CardContent className="p-0">
 {orders && orders.length > 0 ? (
 <div className="divide-y divide-border/50">
 {orders.slice(0, 3).map((order: any) => (
 <div key={order._id} className="p-6 sm:p-8 hover:bg-muted/20 transition-colors">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
 <div>
 <div className="flex items-center gap-3 mb-1">
 <span className="text-[18px] font-semibold text-foreground">{order.orderNumber}</span>
 <Badge variant="outline" className={`font-bold px-2.5 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
 {order.status}
 </Badge>
 </div>
 <span className="text-sm font-medium text-muted-foreground">
 {new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
 </span>
 </div>
 
 <div className="text-left sm:text-right">
 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total</p>
 <p className="text-[18px] font-semibold text-foreground">{currency}{order.total.toLocaleString()}</p>
 </div>
 </div>
 
 <Separator className="my-4 bg-border/50" />
 
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
 <Package className="w-4 h-4" />
 <span>
 {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'} 
 <span className="hidden sm:inline"> • {order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}</span>
 </span>
 </div>
 
 <Button variant="outline" className="rounded-full font-bold border-border/50 hover:bg-primary/5 hover:text-primary transition-colors group" asChild>
 <Link to={`/profile/orders/${order._id}`}>
 View Details
 <ChevronRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
 </Link>
 </Button>
 </div>
 </div>
 ))}
 
 <div className="p-4 sm:hidden">
 <Button variant="outline" className="w-full rounded-2xl h-12 font-bold border-border/50" asChild>
 <Link to="/profile/orders">View All Orders</Link>
 </Button>
 </div>
 </div>
 ) : (
 <EmptyOrders />
 )}
 </CardContent>
 </Card>
 );
};
