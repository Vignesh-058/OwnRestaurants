import { Search, ShoppingBag, Store, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeAnimation = {
 initial: { opacity: 0, y: 10 },
 animate: { opacity: 1, y: 0 },
 transition: { duration: 0.4 },
};

export const EmptyProducts = () => (
 <motion.div {...fadeAnimation} className="flex flex-col items-center justify-center py-24 text-center">
 <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
 <ShoppingBag className="h-10 w-10 text-slate-400" />
 </div>
 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products available</h3>
 <p className="text-slate-500 max-w-sm">We couldn't find any products in this category at the moment. Please check back later.</p>
 </motion.div>
);

export const EmptyCategories = () => (
 <motion.div {...fadeAnimation} className="flex flex-col items-center justify-center py-16 text-center">
 <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
 <Tag className="h-8 w-8 text-slate-400" />
 </div>
 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No categories available</h3>
 <p className="text-sm text-slate-500">Categories are currently being updated.</p>
 </motion.div>
);

export const EmptyOutlets = () => (
 <motion.div {...fadeAnimation} className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center">
 <div className="h-24 w-24 bg-orange-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-orange-100 dark:border-slate-700">
 <Store className="h-12 w-12 text-orange-500" />
 </div>
 <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No outlets are currently available</h3>
 <p className="text-slate-500 text-lg max-w-md">This organization has no active outlets. Please try again later.</p>
 </motion.div>
);

export const EmptySearch = () => (
 <motion.div {...fadeAnimation} className="flex flex-col items-center justify-center py-20 text-center">
 <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
 <Search className="h-10 w-10 text-slate-400" />
 </div>
 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Products will appear when available</h3>
 <p className="text-slate-500 max-w-sm">Try adjusting your search or filters to find what you're looking for.</p>
 </motion.div>
);

export const EmptyBanner = ({ brandName, description }: { brandName?: string, description?: string }) => (
 <div className="relative overflow-hidden bg-info rounded-3xl min-h-[300px] flex items-center justify-center px-6 py-12">
 <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10" />
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="relative z-20 text-center max-w-2xl mx-auto space-y-4"
 >
 <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
 Welcome to {brandName || 'our store'}
 </h1>
 <p className="text-lg md:text-xl text-white/80">
 {description || 'Discover our curated selection of premium products.'}
 </p>
 </motion.div>
 </div>
);
