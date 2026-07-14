import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";
import { ProductCatalogue } from "@/components/product/ProductCatalogue";
import { ProductDrawer } from "@/components/product/ProductDrawer";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { useProductsQuery } from "@/hooks/queries/useProducts";

export const ProductsPage = () => {
  const {
    categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories();

  const {
    data: allProducts,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProductsQuery();

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState(categoryParam || "all");

  // Initialize active category on load
  useEffect(() => {
    if (categories.length > 0) {
      if (categoryParam) {
        const validCategory = categories.find(c => c._id === categoryParam || c._id === 'all');
        if (validCategory) {
          setActiveCategoryId(categoryParam);
          return;
        }
      }
      if (activeCategoryId === "all" || !activeCategoryId) {
        setActiveCategoryId(categories[0]._id);
      }
    }
  }, [categories, categoryParam]);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId !== activeCategoryId) {
      setActiveCategoryId(categoryId);
      setSearchParams({ category: categoryId }, { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-[#F7F8FC] pt-0">
      <motion.div
        key="products-page"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="w-full flex flex-col"
      >
        {isCategoriesLoading || isProductsLoading ? (
          <div className="w-full flex flex-col lg:flex-row p-6 gap-6">
             <div className="w-full lg:w-[360px] flex flex-col gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-14 w-full bg-[#E2E8F0] animate-pulse rounded-[16px]"></div>
                ))}
             </div>
             <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <ProductSkeleton key={i} />
                ))}
             </div>
          </div>
        ) : isCategoriesError || isProductsError ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
            <span className="text-4xl mb-4">🍽️</span>
            <h3 className="text-2xl font-black text-foreground mb-2">Could not load products</h3>
            <p className="text-muted-foreground font-medium">Please check your connection and try again.</p>
          </div>
        ) : categories.length > 0 ? (
          <ProductCatalogue 
            categories={categories}
            allProducts={allProducts}
            activeCategoryId={activeCategoryId}
            onSelectCategory={handleCategorySelect}
            onProductClick={(p) => setSelectedProductId(p._id)}
          />
        ) : null}
      </motion.div>

      {/* Product Drawer for when a user clicks a product */}
      <ProductDrawer 
        itemId={selectedProductId}
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  );
};
