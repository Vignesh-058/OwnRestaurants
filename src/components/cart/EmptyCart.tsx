import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-white rounded-[24px] shadow-sm border border-[#FFE2CC] min-h-[50vh]">
      <div className="w-40 h-40 bg-[#FFF4EB] rounded-full flex items-center justify-center mb-8">
        <ShoppingBag className="w-16 h-16 text-[#FF6B00]" strokeWidth={1.5} />
      </div>
      <h2 className="text-[34px] font-bold mb-3 text-[#1F2937]">Your cart is empty</h2>
      <p className="text-[#6B7280] mb-10 text-[15px] max-w-[300px]">
        Browse delicious dishes and start ordering.
      </p>
      <Button 
        onClick={() => navigate('/products')} 
        className="rounded-[16px] px-12 h-[54px] text-[16px] font-bold bg-[#FF6B00] hover:bg-[#FF7A1A] text-white shadow-[0_4px_16px_rgba(255,107,0,0.2)] hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(255,107,0,0.3)] transition-all duration-300 border-0"
      >
        Continue Shopping
      </Button>
    </div>
  );
};
