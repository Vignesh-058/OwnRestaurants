import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, skeletonClassName, alt, src, ...props }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
      setIsLoaded(false);
      setError(false);
    }, [src]);

    return (
      <div className={cn("relative overflow-hidden flex-shrink-0", className)}>
        {!isLoaded && !error && (
          <Skeleton className={cn("absolute inset-0 w-full h-full", skeletonClassName)} />
        )}
        <img
          ref={ref}
          src={src}
          alt={alt || "Image"}
          loading="lazy"
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            error && "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setError(true);
            setIsLoaded(true);
          }}
          {...props}
        />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
            <span className="text-[10px] font-medium">Failed</span>
          </div>
        )}
      </div>
    );
  }
);

Image.displayName = 'Image';