import { useCategories } from '@/hooks/useCategories';
import { ProductCard } from './ProductCard';
import { useNavigate } from 'react-router-dom';

export const RecommendedProducts = () => {
  const { categories } = useCategories();
  const navigate = useNavigate();

  // Get a random set of products from the 'All' category or just flat map them
  const allProducts = categories.length > 0 ? categories[0].items || [] : [];
  
  // Just take the first 6 as recommendations, or random ones
  const recommended = allProducts.slice(0, 6);

  if (recommended.length === 0) return null;

  return (
    <div className="mt-12 space-y-6">
      <h3 className="font-black text-2xl text-foreground">You may also like</h3>
      <div className="flex overflow-x-auto gap-4 pb-6 hide-scrollbar snap-x">
        {recommended.map((product) => (
          <div key={product._id} className="w-[280px] md:w-[320px] shrink-0 snap-start">
            <ProductCard 
              product={product} 
              onClick={() => {
                navigate(`/product/${product._id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};
