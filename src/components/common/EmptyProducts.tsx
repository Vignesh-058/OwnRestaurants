import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyProductsProps {
 message?: string;
 onReset?: () => void;
}

export const EmptyProducts = ({ message, onReset }: EmptyProductsProps) => {
 const navigate = useNavigate();
 return (
 <div className="flex flex-col items-center justify-center p-14 text-center rounded-3xl border-2 border-dashed bg-white/50">
 <div className="h-18 w-18 bg-primary/10 rounded-full flex items-center justify-center mb-6 p-5">
 <ShoppingBag className="h-10 w-10 text-primary" />
 </div>
 <h3 className="text-xl font-bold mb-2">No Products Found</h3>
 <p className="text-muted-foreground text-sm max-w-xs mb-6">
 {message ?? 'There are no products available in this category right now.'}
 </p>
 {onReset ? (
 <Button variant="outline" className="rounded-full" onClick={onReset}>Clear Filters</Button>
 ) : (
 <Button className="rounded-full" onClick={() => navigate('/')}>Browse All</Button>
 )}
 </div>
 );
};
