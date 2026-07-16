import { useProductFilter } from '@/hooks/useProductFilter';
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrganizationStore } from "@/store/OrganizationStore";
import { useOutletStore } from "@/store/OutletStore";
import { useCategories } from "@/hooks/useCategories";
import { useCoupons } from "@/hooks/queries/useCoupons";
import { useGeoLocation } from "@/hooks/queries/useLocation";
import { useStoreStatus } from "@/hooks/queries/useStoreStatus";
import { ProductDrawer } from "@/components/product/ProductDrawer";
import { StoreStatusLoader } from "@/components/common/StoreStatusLoader";
import { StoreClosedPage } from "@/components/common/StoreClosedPage";
import { SettingsLoader } from "@/components/common/SettingsLoader";
import { StoreConfig } from "@/components/home/StoreConfig";
import { HeroBanner } from "@/components/home/HeroBanner";
import { DeliveryInfoBar } from "@/components/home/DeliveryInfoBar";
import { CategoriesCarousel } from "@/components/home/CategoriesCarousel";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { PopularProducts } from "@/components/home/PopularProducts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TodaysOffers } from "@/components/home/TodaysOffers";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { DownloadApp } from "@/components/home/DownloadApp";
import { Newsletter } from "@/components/home/Newsletter";
import { useSettings } from "@/hooks/queries/useSettings";
import { Button } from "@/components/ui/button";
import { useProductsQuery } from "@/hooks/queries/useProducts";
import {
  
  
  
  
  
} from "@/components/ui/sheet";
import type { FilterState } from "@/components/product/FilterSidebar";

export const LandingPage = () => {
  const navigate = useNavigate();
  const organization = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const belongsTo = organization?._id || "";


  const { data: storeStatusData, isLoading: isStoreStatusLoading } =
    useStoreStatus(belongsTo, selectedOutlet?._id || "");
  const {
    isLoading: isSettingsLoading,
    isError: isSettingsError,
    refetch: refetchSettings,
  } = useSettings(belongsTo, selectedOutlet?._id || "");

  const {
    categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories();

  const {
    data: allProducts = [],
  } = useProductsQuery();

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [filters] = useState<FilterState>({
    categories: [],
    foodType: "all",
    priceRange: [0, 5000],
    rating: 0,
    offers: [],
    deliveryTime: 0,
    availability: [],
    sortBy: "recommended",
  });

  // Initialize active category on load
  useEffect(() => {
    if (categories.length > 0 && activeCategoryId === "all") {
      setActiveCategoryId(categories[0]._id);
    }
  }, [categories, activeCategoryId]);

  const handleCategorySelect = (id: string) => {
    navigate(`/products?category=${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useCoupons();
  useGeoLocation();

  // Handle Hash Navigation (from Navbar Global Sidebar)
  useEffect(() => {
    if (categories.length > 0 && window.location.hash) {
      const id = window.location.hash.substring(1); // remove '#'
      const element = document.getElementById(id);
      if (element) {
        // Small delay to ensure rendering is complete
        setTimeout(() => {
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - 140,
            behavior: "smooth",
          });
          setActiveCategoryId(id);
        }, 100);
      } else if (id === "all") {
        window.scrollTo({ top: 250, behavior: "smooth" });
      }
    }
  }, [categories]);



    const recommendedProductsBase = useMemo(() => {
    return allProducts.filter((p) => p.bestseller || (p.rating && p.rating >= 4.5));
  }, [allProducts]);

  const filteredRecommendedProducts = useProductFilter(recommendedProductsBase, filters);
  const recommendedProducts = useMemo(() => filteredRecommendedProducts.slice(0, 8), [filteredRecommendedProducts]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-background pb-32">
      <motion.div
        key="menu"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="w-full flex flex-col"
      >
        {isStoreStatusLoading ? (
          <StoreStatusLoader />
        ) : storeStatusData?.storeStatus === false && (storeStatusData as any)?.openTime ? (
          <StoreClosedPage
            outlet={selectedOutlet!}
            storeStatus={storeStatusData}
            onBackToHome={() => window.location.reload()}
          />
        ) : isSettingsLoading ? (
          <SettingsLoader />
        ) : isSettingsError ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-background/50 backdrop-blur-sm z-50">
            <h3 className="text-xl font-black tracking-tight text-foreground mb-2">
              Configuration unavailable
            </h3>
            <p className="text-muted-foreground text-sm font-medium mb-6">
              Unable to load outlet settings. Please try again.
            </p>
            <Button
              onClick={() => refetchSettings()}
              variant="default"
              className="rounded-full px-6 font-bold shadow-md"
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <StoreConfig />

            <div className="w-full flex flex-col bg-background">
              <>
                <HeroBanner />
                <DeliveryInfoBar />
                {!isCategoriesLoading && !isCategoriesError && (
                  <CategoriesCarousel
                    categories={categories}
                    activeCategoryId={activeCategoryId}
                    onSelectCategory={handleCategorySelect}
                  />
                )}
                {!isCategoriesLoading && !isCategoriesError && (
                  <PopularProducts
                    products={recommendedProducts}
                    onProductClick={(p) => {
                      if (p.variations && p.variations.length > 0) {
                        setSelectedProductId(p._id);
                      }
                    }}
                  />
                )}
                <TodaysOffers />
                <WhyChooseUs />
                <HowItWorks />
                <CustomerReviews />
                <DownloadApp />
                <Newsletter />
              </>

              {/* Main Product Collection Grid removed as requested */}
            </div>
          </>
        )}
      </motion.div>

      {/* Product Drawer */}
      <ProductDrawer
        itemId={selectedProductId}
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  );
};
