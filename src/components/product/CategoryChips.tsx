import { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category.types';

interface CategoryChipsProps {
 categories: Category[];
 activeCategoryId: string;
 onSelectCategory: (id: string) => void;
}

export const CategoryChips = ({ categories, activeCategoryId, onSelectCategory }: CategoryChipsProps) => {
 const scrollRef = useRef<HTMLDivElement>(null);

 if (!categories || categories.length === 0) return null;

 return (
 <div className="w-full relative py-2">
 <div 
 ref={scrollRef}
 className="flex overflow-x-auto gap-3 hide-scrollbar snap-x snap-mandatory px-1 pb-4 pt-1"
 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
 >
 {categories.map((category, index) => {
 const isActive = activeCategoryId === category._id;
 const isAll = category._id === 'all';

 return (
 <motion.button
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: index * 0.05, duration: 0.3 }}
 key={category._id}
 onClick={() => onSelectCategory(category._id)}
 className={cn(
 "snap-center flex-none flex items-center gap-2 p-1.5 pr-4 rounded-full transition-all duration-300 ease-out border shadow-sm group",
 isActive 
 ? "bg-info text-white border-info shadow-md scale-[1.02]" 
 : "bg-white dark:bg-slate-900 border-border dark:border-white/10 text-foreground dark:text-white hover:border-info/30 hover:shadow-md hover:-translate-y-0.5"
 )}
 >
 {!isAll && (category.iconImage || (category.image as any)?.webView) ? (
 <div className="w-8 h-8 rounded-full overflow-hidden bg-accent dark:bg-slate-800 shrink-0">
 <img 
 src={category.iconImage || (category.image as any)?.webView} 
 alt={category.name} 
 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
 />
 </div>
 ) : !isAll ? (
 <div className="w-8 h-8 rounded-full flex items-center justify-center bg-accent dark:bg-slate-800 shrink-0 font-bold text-sm">
 {category.name.charAt(0)}
 </div>
 ) : null}
 
 <div className={cn("flex items-center gap-2", isAll && "px-3 py-1")}>
 <span className={cn("font-semibold text-sm whitespace-nowrap", isActive ? "text-white" : "text-foreground dark:text-white group-hover:text-info")}>
 {category.name}
 </span>
 
 {!isAll && (
 <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold", isActive ? "bg-white/20 text-white" : "bg-accent dark:bg-slate-800 text-muted-foreground")}>
 {category.items?.length || 0}
 </span>
 )}
 </div>
 </motion.button>
 );
 })}
 </div>
 </div>
 );
};
