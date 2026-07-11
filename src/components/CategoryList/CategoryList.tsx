import { useRef } from 'react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category.types';
import { ChevronRight } from 'lucide-react';

interface CategoryListProps {
 categories: Category[];
 activeCategoryId: string | null;
 onSelectCategory: (id: string) => void;
}

export const CategoryList = ({ categories, activeCategoryId, onSelectCategory }: CategoryListProps) => {
 const scrollRef = useRef<HTMLDivElement>(null);

 if (!categories || categories.length === 0) return null;

 return (
 <div className="w-full sticky top-[72px] md:top-[80px] z-30 bg-background/95 dark:bg-black/90 backdrop-blur-md border-b border-border/40 py-3 transition-all duration-300">
 <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between gap-4">
 
 {/* Title / Header label */}
 <div className="shrink-0 flex items-center gap-2">
 <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Menu</span>
 <div className="h-4 w-px bg-border/80" />
 </div>

 {/* Horizontally scrollable strip */}
 <div className="flex-1 overflow-hidden relative">
 <div 
 ref={scrollRef}
 className="flex items-center gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory py-1 pr-6"
 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
 >
 {categories.map((category) => {
 const isActive = activeCategoryId === category._id;
 const itemCount = category.items?.length || 0;
 
 return (
 <button
 key={category._id}
 onClick={() => onSelectCategory(category._id)}
 className={cn(
 "flex-none h-11 px-3 py-1.5 rounded-full border transition-all duration-300 flex items-center gap-2.5 cursor-pointer select-none",
 isActive 
 ? "bg-primary-gradient border-transparent text-white shadow-md shadow-primary/20 scale-[1.02]" 
 : "bg-card border-border/80 hover:border-primary/30 hover:bg-muted/40 text-foreground"
 )}
 >
 {/* Category Image - Prominent & circular */}
 <div className="w-7.5 h-7.5 rounded-full overflow-hidden shrink-0 border border-black/5 bg-muted">
 {category.imageUrl ? (
 <img 
 src={category.imageUrl} 
 alt={category.name} 
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
 />
 ) : (
 <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-primary/10 text-primary uppercase">
 {category.name.charAt(0)}
 </div>
 )}
 </div>
 
 {/* Name & Count badge */}
 <span className="font-extrabold text-xs whitespace-nowrap leading-none">
 {category.name}
 </span>
 
 <span className={cn(
 "text-[9px] font-black px-2 py-0.5 rounded-full shrink-0",
 isActive 
 ? "bg-white/20 text-white" 
 : "bg-muted text-muted-foreground"
 )}>
 {itemCount}
 </span>
 </button>
 );
 })}
 </div>
 </div>

 {/* Scroll helper arrows */}
 <div className="hidden sm:flex gap-1.5 shrink-0">
 <button 
 onClick={() => {
 if (scrollRef.current) scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
 }}
 className="h-8 w-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted hover:text-foreground text-muted-foreground transition-all shadow-sm"
 >
 <ChevronRight className="h-4 w-4 rotate-180" />
 </button>
 <button 
 onClick={() => {
 if (scrollRef.current) scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
 }}
 className="h-8 w-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted hover:text-foreground text-muted-foreground transition-all shadow-sm"
 >
 <ChevronRight className="h-4 w-4" />
 </button>
 </div>

 </div>
 </div>
 );
};
