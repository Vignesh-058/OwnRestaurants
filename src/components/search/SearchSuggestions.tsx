import { Clock, TrendingUp, X } from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useSearchStore } from '@/store/SearchStore';
import { Button } from '@/components/ui/button';

const POPULAR = ['Biryani', 'Pizza', 'Burger', 'Coffee', 'Sushi', 'Pasta', 'Salad', 'Ice Cream'];

interface SearchSuggestionsProps {
 suggestions: string[];
 onSelect: (query: string) => void;
}

export const SearchSuggestions = ({ suggestions, onSelect }: SearchSuggestionsProps) => {
 const { searchHistory, removeFromHistory, clearHistory } = useSearchHistory();
 const { debouncedQuery } = useSearchStore();

 const isTyping = debouncedQuery.trim().length > 0;

 if (isTyping && suggestions.length > 0) {
 return (
 <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-white rounded-2xl shadow-xl border p-2 overflow-hidden">
 <p className="text-xs font-semibold text-muted-foreground px-3 py-2">Suggestions</p>
 {suggestions.map((s) => (
 <button
 key={s}
 className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-primary/5 text-sm flex items-center gap-3 transition-colors"
 onClick={() => onSelect(s)}
 >
 <TrendingUp className="h-4 w-4 text-primary/50 shrink-0" />
 <span dangerouslySetInnerHTML={{
 __html: s.replace(
 new RegExp(`(${debouncedQuery.trim()})`, 'gi'),
 '<strong>$1</strong>'
 )
 }} />
 </button>
 ))}
 </div>
 );
 }

 if (!isTyping) {
 return (
 <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-white rounded-2xl shadow-xl border p-4 space-y-5 overflow-hidden">
 {/* Recent searches */}
 {searchHistory.length > 0 && (
 <div>
 <div className="flex items-center justify-between mb-2">
 <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
 <Clock className="h-3.5 w-3.5" /> Recent Searches
 </p>
 <button
 className="text-xs text-primary hover:underline"
 onClick={clearHistory}
 >
 Clear All
 </button>
 </div>
 <div className="flex flex-wrap gap-2">
 {searchHistory.map((h) => (
 <div key={h} className="flex items-center gap-1 bg-muted rounded-full px-3 py-1">
 <button className="text-sm font-medium" onClick={() => onSelect(h)}>{h}</button>
 <button
 className="text-muted-foreground hover:text-foreground ml-1"
 onClick={() => removeFromHistory(h)}
 >
 <X className="h-3 w-3" />
 </button>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Popular searches */}
 <div>
 <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
 <TrendingUp className="h-3.5 w-3.5" /> Popular Searches
 </p>
 <div className="flex flex-wrap gap-2">
 {POPULAR.map((p) => (
 <Button
 key={p}
 variant="outline"
 size="sm"
 className="rounded-full h-8 text-xs font-medium"
 onClick={() => onSelect(p)}
 >
 {p}
 </Button>
 ))}
 </div>
 </div>
 </div>
 );
 }

 return null;
};
