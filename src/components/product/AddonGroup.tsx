import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { AddonGroup as AddonGroupType } from '@/types/product.types';

interface AddonGroupProps {
 group: AddonGroupType;
 selectedAddons: string[];
 onChange: (groupId: string, addonId: string, checked: boolean, max: number) => void;
 currency: string;
}

export const AddonGroup = ({ group, selectedAddons, onChange, currency }: AddonGroupProps) => {
 return (
 <div className="space-y-4">
 <div>
 <h3 className="font-bold text-lg text-foreground dark:text-white flex items-center gap-2">
 {group.addongroup_name}
 {group.min > 0 && (
 <span className="text-[10px] uppercase tracking-wider bg-info/10 text-info px-2 py-1 rounded-full font-bold">
 Required
 </span>
 )}
 </h3>
 <p className="text-sm text-muted-foreground font-medium mt-1">
 {group.min > 0 ? `Select at least ${group.min} ` : 'Optional '}
 {group.max > 0 ? `(Max ${group.max})` : ''}
 </p>
 </div>

 <div className="space-y-3">
 {group.items.map((addon) => {
 const isSelected = selectedAddons.includes(addon.addonitemid);
 const isMaxReached = !isSelected && group.max > 0 && selectedAddons.length >= group.max;

 return (
 <div 
 key={addon.addonitemid} 
 className={cn(
 "flex items-center justify-between p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all cursor-pointer group",
 isSelected ? "border-info bg-accent dark:bg-slate-800" : "hover:border-info/50",
 isMaxReached && "opacity-50 cursor-not-allowed"
 )}
 onClick={() => {
 if (!isMaxReached || isSelected) {
 onChange(group.addongroupid, addon.addonitemid, !isSelected, group.max);
 }
 }}
 >
 <div className="flex items-center space-x-3">
 {group.max === 1 ? (
 <RadioGroup 
 value={selectedAddons[0] || ''} 
 onValueChange={() => onChange(group.addongroupid, addon.addonitemid, true, group.max)}
 className="pointer-events-none"
 >
 <div className="flex items-center space-x-3">
 <RadioGroupItem value={addon.addonitemid} id={addon.addonitemid} />
 <Label htmlFor={addon.addonitemid} className="text-base font-semibold text-foreground dark:text-white cursor-pointer group-hover:text-info transition-colors">
 {addon.addonitem_name}
 </Label>
 </div>
 </RadioGroup>
 ) : (
 <>
 <Checkbox 
 id={addon.addonitemid}
 checked={isSelected}
 disabled={isMaxReached}
 className="pointer-events-none"
 />
 <Label 
 htmlFor={addon.addonitemid} 
 className="text-base font-semibold text-foreground dark:text-white cursor-pointer group-hover:text-info transition-colors"
 >
 {addon.addonitem_name}
 </Label>
 </>
 )}
 </div>
 {addon.addonitem_price > 0 && (
 <span className="font-bold text-muted-foreground">
 +{currency}{addon.addonitem_price}
 </span>
 )}
 </div>
 );
 })}
 </div>
 </div>
 );
};
