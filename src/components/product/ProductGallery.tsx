import { motion } from 'framer-motion';

interface ProductGalleryProps {
 images?: string[];
 productName: string;
}

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
 const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
 const mainImage = images?.[0] || defaultImage;

 return (
 <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
 <motion.img 
 initial={{ scale: 1.1, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{ duration: 0.5, ease: 'easeOut' }}
 src={mainImage} 
 alt={productName} 
 className="w-full h-full object-cover" 
 />
 
 {/* Premium Gradient overlay */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
 </div>
 );
};
