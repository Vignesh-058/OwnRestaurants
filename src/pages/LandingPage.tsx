import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, Ticket } from "lucide-react";
import { useOrganizationStore } from "@/store/OrganizationStore";
import { useOutletStore } from "@/store/OutletStore";
import { useLocationStore } from "@/store/LocationStore";
import { useLocationModalStore } from "@/store/LocationModalStore";
import { useAuthStore } from "@/store/AuthStore";
import { useCategories } from "@/hooks/useCategories";
import { useCoupons } from "@/hooks/queries/useCoupons";
import { useGeoLocation } from "@/hooks/queries/useLocation";
import { useStoreStatus } from "@/hooks/queries/useStoreStatus";
import { BannerCarousel } from "@/components/banner/BannerCarousel";
import { CategoryList } from "@/components/product/CategoryList";
import { ProductDrawer } from "@/components/product/ProductDrawer";
import { StoreStatusLoader } from "@/components/common/StoreStatusLoader";
import { StoreClosedPage } from "@/components/common/StoreClosedPage";
import { SettingsLoader } from "@/components/common/SettingsLoader";
import { StoreConfig } from "@/components/home/StoreConfig";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoriesCarousel } from "@/components/home/CategoriesCarousel";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { PopularProducts } from "@/components/home/PopularProducts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PromotionalBanner } from "@/components/home/PromotionalBanner";
import { AboutSection } from "@/components/home/AboutSection";
import { useSettings } from "@/hooks/queries/useSettings";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import type { CategoryItem } from "@/types/category.types";
import { cn } from "@/lib/utils";

export const LandingPage = () => {
  const navigate = useNavigate();
  const organization = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const belongsTo = organization?._id || "";

  const { formattedAddress, street, city } = useLocationStore();
  const openModal = useLocationModalStore((state) => state.openModal);
  const { user } = useAuthStore();

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
    refetch: refetchCategories,
  } = useCategories();

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    foodType: "all",
    priceRange: [0, 5000],
    rating: 0,
    offers: [],
    deliveryTime: 0,
    availability: [],
    sortBy: "recommended",
  });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

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

  const { data: coupons = [] } = useCoupons();
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
  }, [categories, window.location.hash]);
  const applyFiltersToItems = (items: any[]) => {
    let filtered = items;

    // Categories
    if (filters.categories.length > 0) {
      // Handled at the top level
    }

    // Food Type
    if (filters.foodType === "veg") {
      filtered = filtered.filter(
        (item: any) =>
          item.dietryType?.toLowerCase() === "veg" ||
          item.dietryType?.toLowerCase() === "vegan" ||
          item.type?.toLowerCase() === "veg",
      );
    } else if (filters.foodType === "non-veg") {
      filtered = filtered.filter(
        (item: any) =>
          item.dietryType?.toLowerCase() === "non-veg" ||
          item.dietryType?.toLowerCase() === "non veg" ||
          item.type?.toLowerCase() === "non-veg",
      );
    }

    // Price
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) {
      filtered = filtered.filter((item: any) => {
        const price = item.sellingPrice || item.basePrice || 0;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Rating
    if (filters.rating > 0) {
      filtered = filtered.filter(
        (item: any) => (item.rating || 0) >= filters.rating,
      );
    }

    // Offers
    if (filters.offers.length > 0) {
      filtered = filtered.filter((item: any) => {
        let hasOffer = false;
        if (
          filters.offers.includes("discount") &&
          (item.discount?.value?.amount > 0 ||
            item.discount?.value?.getDiscountPercent > 0)
        )
          hasOffer = true;
        // Mocking other offers since the backend may not have explicit fields for combo, bogo, free-delivery
        if (filters.offers.includes("free-delivery") && item.sellingPrice > 500)
          hasOffer = true;
        if (
          filters.offers.includes("combo") &&
          (item.name || "").toLowerCase().includes("combo")
        )
          hasOffer = true;
        if (
          filters.offers.includes("bogo") &&
          (item.name || "").toLowerCase().includes("bogo")
        )
          hasOffer = true;
        return hasOffer;
      });
    }

    // Availability
    if (filters.availability.length > 0) {
      filtered = filtered.filter((item: any) => {
        if (filters.availability.includes("out-of-stock")) return !item.inStock;
        if (filters.availability.includes("available"))
          return item.inStock !== false;
        return true;
      });
    }

    // Sort
    filtered = [...filtered].sort((a: any, b: any) => {
      const priceA = a.sellingPrice || a.basePrice || 0;
      const priceB = b.sellingPrice || b.basePrice || 0;
      switch (filters.sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "best-selling":
          return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const featuredProducts = useMemo(() => {
    const allProducts = categories.flatMap((c) => c.items || []);
    const featured = allProducts.filter((p) => {
      if (Array.isArray(p.tag)) {
        return p.tag.some(
          (t: any) =>
            t?.name?.toLowerCase() === "featured" ||
            t?.toLowerCase() === "featured",
        );
      }
      return (
        (p.tag as any)?.name?.toLowerCase() === "featured" ||
        (p.tag as string)?.toLowerCase() === "featured"
      );
    });

    const fallbackFeatured =
      featured.length > 0
        ? featured
        : allProducts.filter((p) => p.discount?.value).slice(0, 8);
    return applyFiltersToItems(fallbackFeatured).slice(0, 8);
  }, [categories, filters]);

  const recommendedProducts = useMemo(() => {
    const allProducts = categories.flatMap((c) => c.items || []);
    const recs = allProducts.filter(
      (p) => p.bestseller || (p.rating && p.rating >= 4.5),
    );
    return applyFiltersToItems(recs).slice(0, 8);
  }, [categories, filters]);

  const handleProductClick = (product: CategoryItem) => {
    setSelectedProductId(product._id);
  };

  const handleRequestLocation = () => {
    openModal();
  };

  const handleRemoveFilter = (key: keyof FilterState, value: any) => {
    if (Array.isArray(filters[key])) {
      setFilters((prev) => ({
        ...prev,
        [key]: (prev[key] as any[]).filter((v) => v !== value),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [key]:
          key === "priceRange"
            ? [0, 5000]
            : key === "foodType"
              ? "all"
              : key === "rating" || key === "deliveryTime"
                ? 0
                : "",
      }));
    }
  };

  const handleClearAllFilters = () => {
    setFilters({
      categories: [],
      foodType: "all",
      priceRange: [0, 5000],
      rating: 0,
      offers: [],
      deliveryTime: 0,
      availability: [],
      sortBy: "recommended",
    });
  };

  const renderFilteredCategories = () => {
    // Only render the active category
    const activeCategory = categories.find((c) => c._id === activeCategoryId);

    if (!activeCategory) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full flex flex-col items-center justify-center py-24 text-center px-4"
        >
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 shadow-inner">
            <span className="text-4xl">🍽️</span>
          </div>
          <h3 className="text-2xl font-black text-foreground tracking-tight mb-3">
            Category not found
          </h3>
          <p className="text-muted-foreground mb-8 max-w-[400px]">
            Please select a valid category from the sidebar.
          </p>
        </motion.div>
      );
    }

    const items = activeCategory.items || [];
    const filteredItems = applyFiltersToItems(items);
    const categoryName =
      (activeCategory as any).categoryName ||
      activeCategory.name ||
      (activeCategory as any).displayName ||
      (activeCategory as any).title ||
      "Unknown";

    if (filteredItems.length === 0) {
      return null;
    }

    return (
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          key={activeCategory._id}
          id={activeCategory._id}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[32px] md:text-[40px] font-black text-[#111827] tracking-tight flex items-center gap-4">
              {categoryName}
              <span className="text-sm md:text-base font-bold text-[#FF6B00] bg-[#FFF7ED] px-4 py-1.5 rounded-full shadow-[0_2px_10px_rgba(255,107,0,0.1)]">
                {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "Item" : "Items"}
              </span>
            </h2>
          </div>
          <ProductGrid
            products={filteredItems}
            onProductClick={(p) => setSelectedProductId(p._id)}
          />
        </motion.div>
      </AnimatePresence>
    );
  };

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
        ) : storeStatusData?.storeStatus === false && !import.meta.env.DEV ? (
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
              {/* 1. Hero Banner */}
              <HeroBanner />

              {/* 2. Categories Carousel */}
              {!isCategoriesLoading &&
                !isCategoriesError &&
                categories.length > 0 && (
                  <CategoriesCarousel
                    categories={categories}
                    activeCategoryId={activeCategoryId}
                    onSelectCategory={handleCategorySelect}
                  />
                )}

              {/* 3. Why Choose Us */}
              <WhyChooseUs />

              {/* 4. Popular Products Carousel */}
              {!isCategoriesLoading &&
                !isCategoriesError &&
                recommendedProducts.length > 0 && (
                  <PopularProducts
                    products={recommendedProducts}
                    onProductClick={(p) => setSelectedProductId(p._id)}
                  />
                )}

              {/* 5. How It Works */}
              <HowItWorks />

              {/* 6. Promotional Banner */}
              <PromotionalBanner />

              {/* Main Product Collection Grid removed as requested */}
              {/* 9. About Section */}
              <AboutSection />
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
