import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images?: string[];
  productName: string;
}

export const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainRef, emblaMainApi] = useEmblaCarousel({ loop: true });
  const [thumbRef, emblaThumbApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on('select', onSelect);
    emblaMainApi.on('reInit', onSelect);
  }, [emblaMainApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const scrollNext = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-muted flex items-center justify-center rounded-3xl">
        <ShoppingBag className="h-20 w-20 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Slider */}
      <div className="relative group">
        <div className="overflow-hidden rounded-3xl bg-muted aspect-square md:aspect-[4/3] lg:aspect-square" ref={mainRef}>
          <div className="flex touch-pan-y h-full">
            {images.map((img, index) => (
              <div
                className="flex-[0_0_100%] min-w-0 relative"
                key={index}
              >
                <img
                  src={img}
                  alt={`${productName} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-md z-10"
              onClick={scrollPrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-md z-10"
              onClick={scrollNext}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            
            {/* Mobile dots indicator */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === selectedIndex ? "bg-primary w-4" : "bg-primary/40"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails (Desktop) */}
      {images.length > 1 && (
        <div className="hidden md:block overflow-hidden" ref={thumbRef}>
          <div className="flex gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                className={cn(
                  "flex-[0_0_20%] min-w-0 aspect-square rounded-xl overflow-hidden cursor-pointer transition-all border-2",
                  index === selectedIndex ? "border-primary shadow-sm scale-95" : "border-transparent opacity-70 hover:opacity-100"
                )}
                onClick={() => onThumbClick(index)}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
