import { useBanners } from '@/hooks/queries/useBanners';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import ENV from '@/config/env';

export const OffersCarousel = () => {
  const organization = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

  const { data: banners, isLoading, isError } = useBanners(
    organization?._id || '',
    selectedOutlet?._id || ''
  );

  const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  if (isLoading) {
    return (
      <div className="w-full mb-8">
        <Skeleton className="w-full h-[200px] sm:h-[300px] md:h-[400px] rounded-3xl" />
      </div>
    );
  }

  if (isError || !banners || banners.length === 0) {
    return null; // Return nothing if there are no active banners.
  }

  return (
    <div className="w-full mb-8 group relative rounded-3xl overflow-hidden shadow-lg border border-[#FFE2CC]">
      <Carousel
        plugins={[autoplayPlugin.current]}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {banners.map((banner, index) => (
            <CarouselItem key={banner._id || index} className="pl-0">
              <Card className="border-0 bg-transparent rounded-none">
                <CardContent className="p-0 flex aspect-[2/1] sm:aspect-[21/9] lg:aspect-[3/1] items-center justify-center relative overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={`${ENV.IMAGE_BASE_URL}${(banner as any).image?.webView || (banner as any).image?.mobileView || (banner as any).imageUrl || (banner as any).images?.bannerImage}`}
                    alt={banner.title || `Offer Banner ${index + 1}`}
                    className="w-full h-full object-cover select-none"
                    loading="lazy"
                  />
                  {/* Subtle gradient overlay to make text readable if text were added on top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {banners.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-[#FF6B00] border-none shadow-md h-10 w-10 hidden sm:flex" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-[#FF6B00] border-none shadow-md h-10 w-10 hidden sm:flex" />
          </>
        )}
      </Carousel>
    </div>
  );
};
