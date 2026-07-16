import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CustomerAddress } from '@/types/customer.types';
import { MapPin, Home, Briefcase, MapPinned, MoreVertical, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddressCardProps {
 address: CustomerAddress;
 onUseForDelivery?: (address: CustomerAddress) => void;
}

export const AddressCard = ({ address, onUseForDelivery }: AddressCardProps) => {
 const [copied, setCopied] = useState(false);

 const getTypeIcon = () => {
 switch (address.type?.toLowerCase()) {
 case 'home': return <Home className="h-4 w-4" />;
 case 'work': return <Briefcase className="h-4 w-4" />;
 default: return <MapPinned className="h-4 w-4" />;
 }
 };

 const getFullAddressString = () => {
 const parts = [
 address.address1,
 address.address2,
 address.landMark ? `Near ${address.landMark}` : null,
 address.city,
 address.state,
 address.pincode
 ].filter(Boolean);
 return parts.join(', ');
 };

 const handleCopy = () => {
 navigator.clipboard.writeText(getFullAddressString());
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 return (
 <Card className="rounded-3xl border shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden">
 {/* Subtle top border accent based on type */}
 <div className={`absolute top-0 left-0 w-full h-1 ${address.type?.toLowerCase() === 'home' ? 'bg-primary' : address.type?.toLowerCase() === 'work' ? 'bg-orange-500' : 'bg-gray-400'}`} />
 
 <CardContent className="p-6">
 <div className="flex justify-between items-start mb-4">
 <div className="flex items-center gap-2">
 <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1 rounded-full font-medium capitalize">
 {getTypeIcon()}
 {address.type}
 </Badge>
 {address.isDefault && (
 <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1 rounded-full font-medium">
 Default
 </Badge>
 )}
 </div>
 
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity">
 <MoreVertical className="h-4 w-4" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="w-[160px] rounded-2xl">
 <DropdownMenuItem onClick={handleCopy} className="rounded-xl cursor-pointer">
 {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
 {copied ? 'Copied!' : 'Copy Address'}
 </DropdownMenuItem>
 <DropdownMenuItem disabled className="rounded-xl">Edit (Coming Soon)</DropdownMenuItem>
 <DropdownMenuItem disabled className="rounded-xl text-destructive focus:text-destructive">Delete (Coming Soon)</DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 </div>

 <div className="mb-4">
 <h4 className="font-bold text-foreground text-lg mb-1">{address.customerName}</h4>
 <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
 {getFullAddressString()}
 </p>
 </div>

 <div className="flex items-center gap-4 text-xs text-muted-foreground/70 mb-6">
 {address.latitude && address.longitude && (
 <div className="flex items-center gap-1">
 <MapPin className="h-3 w-3" />
 <span>Location Saved</span>
 </div>
 )}
 </div>

 <div className="flex gap-3">
 <Button 
 className="flex-1 rounded-full font-medium shadow-premium" 
 variant={address.isDefault ? "outline" : "default"}
 onClick={() => onUseForDelivery?.(address)}
 >
 Use for Delivery
 </Button>
 </div>
 </CardContent>
 </Card>
 );
};
