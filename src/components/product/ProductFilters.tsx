export const ProductFilters = () => {
 return (
 <div className="w-full bg-background/80 sticky top-[80px] md:top-[100px] z-30 border-b border-border shadow-sm backdrop-blur-2xl transition-all duration-300">
 <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex items-center justify-start gap-4">
 {/* Quick Filters Placeholder (e.g., Sort, Veg Only) */}
 <div className="flex gap-3 items-center">
 <button className="px-5 py-2.5 rounded-full bg-card border border-border text-sm font-semibold hover:border-primary hover:text-primary transition-all shadow-sm whitespace-nowrap">
 Vegetarian
 </button>
 <button className="px-5 py-2.5 rounded-full bg-card border border-border text-sm font-semibold hover:border-primary hover:text-primary transition-all shadow-sm whitespace-nowrap">
 Sort by Price
 </button>
 </div>
 </div>
 </div>
 );
};
