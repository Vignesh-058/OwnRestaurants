import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProductNutrition } from './ProductNutrition';
import { ProductReviews } from './ProductReviews';
import { Clock, ChefHat, Utensils, Info } from 'lucide-react';
import type { CategoryItem } from '@/types/category.types';

interface ProductInfoTabsProps {
  product: CategoryItem;
}

type TabKey = 'description' | 'ingredients' | 'nutrition' | 'reviews';

export const ProductInfoTabs = ({ product }: ProductInfoTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>('description');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'description', label: 'Overview' },
    { key: 'ingredients', label: 'Ingredients' },
    { key: 'nutrition', label: 'Nutrition' },
    { key: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="w-full mt-6">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative px-5 py-2.5 rounded-[14px] text-sm font-bold whitespace-nowrap transition-all duration-300 shadow-sm border",
                isActive 
                  ? "bg-[#FF6B00] text-white border-[#FF6B00]" 
                  : "bg-white text-muted-foreground border-border/50 hover:border-[#FF6B00]/30 hover:text-foreground"
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 rounded-[14px] bg-[#FF6B00] -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeTab === 'description' && (
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-border/50 space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" /> About this item
                  </h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {product.description || "A delicious and finely crafted dish, made with the freshest ingredients to satisfy your cravings. Perfect for any time of the day."}
                  </p>
                </div>
                <hr className="border-border/50" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Prep Time
                    </span>
                    <span className="font-bold text-foreground">25-30 mins</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                      <Utensils className="w-3 h-3" /> Serving
                    </span>
                    <span className="font-bold text-foreground">1 Person</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                      <ChefHat className="w-3 h-3" /> Category
                    </span>
                    <span className="font-bold text-foreground capitalize">{product.category || 'Specialty'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-border/50 space-y-4">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-primary" /> Key Ingredients
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Premium Quality Ingredients, Secret Spice Blend, Fresh Herbs, Cold-pressed Oils, Farm-fresh Produce.
                </p>
                <div className="mt-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                  <p className="text-sm font-semibold text-orange-800">
                    <span className="font-bold">Allergen Advice:</span> May contain traces of dairy and nuts. Please check with the restaurant if you have severe allergies.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-border/50 space-y-6">
                <h3 className="font-bold text-lg mb-2">Nutritional Values</h3>
                <p className="text-sm text-muted-foreground font-medium mb-6">
                  Approximate values per serving. Actual values may vary based on preparation.
                </p>
                <ProductNutrition />
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl">Customer Reviews</h3>
                    <p className="text-muted-foreground text-sm font-medium">Based on 120 verified ratings</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-foreground flex items-center gap-2">
                      4.8 <Star className="w-6 h-6 fill-green-600 text-green-600" />
                    </div>
                  </div>
                </div>
                <ProductReviews />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
