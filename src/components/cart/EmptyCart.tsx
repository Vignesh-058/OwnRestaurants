import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-border min-h-[50vh]">
      <div className="w-40 h-40 bg-accent rounded-full flex items-center justify-center mb-8">
        <ShoppingBag className="w-16 h-16 text-primary" strokeWidth={1.5} />
      </div>
      <h2 className="text-[34px] font-bold mb-3 text-foreground">Your cart is empty</h2>
      <p className="text-muted-foreground mb-10 text-[15px] max-w-[300px]">
        Looks like you haven't added anything yet.
      </p>
      <Button 
        onClick={() => navigate('/products')} 
        className="rounded-full px-12 h-[54px] text-[16px] font-bold bg-primary hover:bg-primary text-white shadow-[0_8px_25px_rgba(255,107,0,0.25)] hover:-translate-y-1 transition-all duration-300 border-0"
      >
        Browse Products
      </Button>
    </div>
  );
};
