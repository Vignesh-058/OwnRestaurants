import { CartItem } from './CartItem';
import type { CartItem as CartItemType } from '@/types/cart.types';

interface CartListProps {
 items: CartItemType[];
 currency: string;
 onUpdateQuantity: (item: CartItemType, newQuantity: number) => void;
 onRemove: (item: CartItemType) => void;
 isUpdating: boolean;
}

export const CartList = ({ items, currency, onUpdateQuantity, onRemove, isUpdating }: CartListProps) => {
  return (
    <div className="flex-1 flex flex-col gap-[20px]">
      {items.map((item) => (
        <CartItem 
          key={item._id}
          item={item}
          currency={currency}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
};
