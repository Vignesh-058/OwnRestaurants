import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhoneInputProps {
 phone: string;
 onChange: (value: string) => void;
 disabled?: boolean;
}

export const PhoneInput = ({ phone, onChange, disabled }: PhoneInputProps) => {
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 // Only allow digits and max 10 characters
 const value = e.target.value.replace(/\D/g, '').slice(0, 10);
 onChange(value);
 };

 return (
 <div className="space-y-3 w-full">
 <Label htmlFor="phone" className="text-sm font-bold text-muted-foreground">Mobile Number</Label>
 <div className="flex rounded-2xl border border-border shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-card overflow-hidden h-14">
 <div className="flex items-center justify-center px-4 bg-muted/50 border-r border-border font-bold text-muted-foreground">
 +91
 </div>
 <Input
 id="phone"
 type="tel"
 inputMode="numeric"
 autoComplete="tel"
 placeholder="Enter 10 digit number"
 value={phone}
 onChange={handleChange}
 disabled={disabled}
 className="flex-1 border-0 rounded-none h-full focus-visible:ring-0 px-4 text-lg font-semibold bg-transparent"
 />
 </div>
 </div>
 );
};
