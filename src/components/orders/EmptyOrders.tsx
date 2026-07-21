import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const EmptyOrders = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl bg-[#FFFFFF] border border-[#FFE2CC] shadow-sm">
      <div className="h-20 w-20 bg-[#FFF4EB] rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="h-10 w-10 text-[#FF6B00]" />
      </div>
      <h3 className="text-[24px] font-bold tracking-tight text-[#1F2937] mb-2">No orders yet</h3>
      <p className="text-[#6B7280] max-w-sm mb-8 text-[14px]">
        Looks like you haven't placed any orders yet. Discover our delicious meals and place your first order!
      </p>
      <Button
        className="rounded-xl px-10 shadow-sm bg-[#FF6B00] hover:bg-[#FF7A1A] text-white font-bold h-11 transition-all"
        size="lg"
        onClick={() => navigate('/')}
      >
        Continue Shopping
      </Button>
    </div>
  );
};
