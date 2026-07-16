import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SearchBarProps {
 value: string;
 onChange: (value: string) => void;
 onClear: () => void;
 placeholder?: string;
 className?: string;
}

export const SearchBar = ({ 
 value, 
 onChange, 
 onClear, 
 placeholder = "Search burgers, pizza, drinks...",
 className
}: SearchBarProps) => {
 const [isFocused, setIsFocused] = useState(false);

 return (
 <div className={cn("relative w-full transition-all duration-300", className)}>
 <div className={cn(
 "relative flex items-center w-full bg-white rounded-full border transition-all duration-300",
 isFocused 
 ? "border-info shadow-lg ring-4 ring-info/10" 
 : "border-border dark:border-white/10 hover:border-info/50"
 )}>
 <Search className={cn("absolute left-4 h-5 w-5 transition-colors", isFocused ? "text-info" : "text-muted-foreground")} />
 <Input 
 type="text" 
 value={value}
 onChange={(e) => onChange(e.target.value)}
 onFocus={() => setIsFocused(true)}
 onBlur={() => setIsFocused(false)}
 placeholder={placeholder} 
 className="w-full bg-transparent h-14 pl-12 pr-12 border-none focus-visible:ring-0 text-base shadow-none text-foreground dark:text-white rounded-full"
 />
 {value && (
 <button 
 onClick={onClear}
 className="absolute right-4 p-1.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 text-muted-foreground transition-colors"
 >
 <X className="h-4 w-4" />
 </button>
 )}
 </div>
 </div>
 );
};
