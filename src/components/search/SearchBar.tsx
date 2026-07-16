import { useRef, useState, useEffect } from 'react';
import { Search, X, Mic } from 'lucide-react';
import { useSearchQuery } from '@/hooks/useSearch';
import { useSearch } from '@/hooks/useSearch';
import { SearchSuggestions } from './SearchSuggestions';
import { useSearchStore } from '@/store/SearchStore';
import { cn } from '@/lib/utils';

interface SearchBarProps {
 autoFocus?: boolean;
 className?: string;
}

export const SearchBar = ({ autoFocus, className }: SearchBarProps) => {
 const { query, handleChange, clear } = useSearchQuery();
 const { suggestions, allProducts } = useSearch();
 const { setDebouncedQuery, addToHistory } = useSearchStore();
 const [showSuggestions, setShowSuggestions] = useState(false);
 const [isFocused, setIsFocused] = useState(false);
 const containerRef = useRef<HTMLDivElement>(null);
 const inputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
 if (autoFocus) inputRef.current?.focus();
 }, [autoFocus]);

 // Close on outside click
 useEffect(() => {
 const handler = (e: MouseEvent) => {
 if (!containerRef.current?.contains(e.target as Node)) {
 setShowSuggestions(false);
 }
 };
 document.addEventListener('mousedown', handler);
 return () => document.removeEventListener('mousedown', handler);
 }, []);

 const handleSelect = (q: string) => {
 handleChange(q);
 setDebouncedQuery(q);
 addToHistory(q);
 setShowSuggestions(false);
 inputRef.current?.blur();
 };

 const handleKeyDown = (e: React.KeyboardEvent) => {
 if (e.key === 'Escape') {
 setShowSuggestions(false);
 inputRef.current?.blur();
 }
 if (e.key === 'Enter' && query.trim()) {
 addToHistory(query.trim());
 setShowSuggestions(false);
 }
 };

 return (
 <div ref={containerRef} className={cn('relative w-full', className)}>
 <div className={cn(
 'flex items-center gap-3 bg-white border-2 rounded-full px-5 h-14 transition-all duration-200 shadow-sm',
 isFocused ? 'border-primary shadow-primary/20 shadow-md' : 'border-border hover:border-primary/40',
 )}>
 <Search className={cn('h-5 w-5 shrink-0 transition-colors', isFocused ? 'text-primary' : 'text-muted-foreground')} />

 <input
 ref={inputRef}
 type="text"
 value={query}
 onChange={(e) => handleChange(e.target.value)}
 onFocus={() => { setIsFocused(true); setShowSuggestions(true); }}
 onBlur={() => setIsFocused(false)}
 onKeyDown={handleKeyDown}
 placeholder="Search products, categories..."
 className="flex-1 bg-transparent outline-none text-base font-medium placeholder:text-muted-foreground/60"
 aria-label="Search products"
 aria-autocomplete="list"
 aria-haspopup="listbox"
 role="combobox"
 aria-expanded={showSuggestions}
 />

 {/* Clear */}
 {query && (
 <button
 onClick={() => { clear(); inputRef.current?.focus(); }}
 className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
 aria-label="Clear search"
 >
 <X className="h-4 w-4" />
 </button>
 )}

 {/* Mic placeholder */}
 <button
 className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
 onClick={() => {}} // Voice search placeholder
 aria-label="Voice search"
 title="Voice search (coming soon)"
 >
 <Mic className="h-4 w-4" />
 </button>
 </div>

 {/* Dropdown suggestions */}
 {showSuggestions && (
 <SearchSuggestions suggestions={suggestions} allProducts={allProducts} onSelect={handleSelect} />
 )}
 </div>
 );
};
