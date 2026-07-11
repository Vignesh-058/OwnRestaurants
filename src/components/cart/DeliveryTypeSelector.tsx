import { useCartStore } from '@/store/CartStore';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Bike, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DeliveryTypeSelector = () => {
 const deliveryType = useCartStore((state) => state.deliveryType);
 const setDeliveryType = useCartStore((state) => state.setDeliveryType);

 return (
 <div className="bg-card p-6 rounded-3xl border shadow-sm mb-6">
 <h3 className="font-bold text-lg mb-4">Delivery Option</h3>
 <RadioGroup 
 value={deliveryType} 
 onValueChange={setDeliveryType} 
 className="grid grid-cols-2 gap-4"
 >
 <div 
 className={cn(
 "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all hover:bg-secondary/50",
 deliveryType === 'Door Delivery' ? "border-primary bg-primary/5 shadow-sm" : "border-border"
 )}
 onClick={() => setDeliveryType('Door Delivery')}
 >
 <RadioGroupItem value="Door Delivery" id="door-delivery" className="sr-only" />
 <Bike className={cn("w-8 h-8 mb-2", deliveryType === 'Door Delivery' ? "text-primary" : "text-muted-foreground")} />
 <Label htmlFor="door-delivery" className="font-bold cursor-pointer">Delivery</Label>
 </div>
 
 <div 
 className={cn(
 "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all hover:bg-secondary/50",
 deliveryType === 'Self Pickup' ? "border-primary bg-primary/5 shadow-sm" : "border-border"
 )}
 onClick={() => setDeliveryType('Self Pickup')}
 >
 <RadioGroupItem value="Self Pickup" id="self-pickup" className="sr-only" />
 <Store className={cn("w-8 h-8 mb-2", deliveryType === 'Self Pickup' ? "text-primary" : "text-muted-foreground")} />
 <Label htmlFor="self-pickup" className="font-bold cursor-pointer">Pickup</Label>
 </div>
 </RadioGroup>
 </div>
 );
};
