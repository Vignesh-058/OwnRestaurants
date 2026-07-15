import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import ENV from '@/config/env';

interface ProductGalleryProps {
  images?: string[];
  productName: string;
}

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
  
  const getImageUrl = (path?: string) => {
    if (!path) return defaultImage;
    if (path.startsWith("http")) return path;
    const baseUrl = ENV.API_BASE_URL || "";
    return `${baseUrl}/${path.replace(/^\//, "")}`;
  };

  const validImages = images && images.length > 0 ? images.map(getImageUrl) : [defaultImage];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-muted overflow-hidden group">
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex w-full h-full touch-pan-y">
          {validImages.map((imgUrl, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full w-full">
              <motion.img 
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                src={imgUrl} 
                alt={`${productName} - Image ${index + 1}`} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== defaultImage) {
                    target.src = defaultImage;
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Premium Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Pagination Dots */}
      {validImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {validImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={cn(
                "transition-all duration-300 rounded-full",
                selectedIndex === idx 
                  ? "w-6 h-2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" 
                  : "w-2 h-2 bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
