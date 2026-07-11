

export const mockCategories = [
 { _id: 'c1', name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80' },
 { _id: 'c2', name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80' },
 { _id: 'c3', name: 'Home & Living', image: 'https://images.unsplash.com/photo-1556020685-e631933df289?w=400&q=80' },
 { _id: 'c4', name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80' },
 { _id: 'c5', name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80' },
 { _id: 'c6', name: 'Groceries', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80' },
 { _id: 'c7', name: 'Toys', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80' },
 { _id: 'c8', name: 'Books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80' },
];

type MockProduct = { _id: string; name: string; price: number; originalPrice?: number; image: string; rating: number; inStock: boolean; badge?: string; };
export const mockProducts: MockProduct[] = [
 {
 _id: 'p1',
 name: 'Premium Wireless Headphones with Active Noise Cancellation',
 price: 14999,
 originalPrice: 19999,
 image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
 rating: 4.8,
 inStock: true,
 badge: 'Bestseller'
 },
 {
 _id: 'p2',
 name: 'Minimalist Smart Watch Series 8',
 price: 24999,
 originalPrice: 29999,
 image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
 rating: 4.9,
 inStock: true,
 badge: 'New Arrival'
 },
 {
 _id: 'p3',
 name: 'Ergonomic Office Chair',
 price: 8999,
 image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80',
 rating: 4.5,
 inStock: true,
 },
 {
 _id: 'p4',
 name: 'Professional DSLR Camera Lens',
 price: 45999,
 originalPrice: 52999,
 image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
 rating: 4.7,
 inStock: false,
 badge: 'Trending'
 },
 {
 _id: 'p5',
 name: 'Organic Skincare Essential Kit',
 price: 2999,
 originalPrice: 3999,
 image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
 rating: 4.6,
 inStock: true,
 },
 {
 _id: 'p6',
 name: 'Smart Home Speaker Assistant',
 price: 4999,
 image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80',
 rating: 4.3,
 inStock: true,
 }
];

// Shuffle helper for variation in mock sections
export const getShuffledProducts = () => {
 return [...mockProducts].sort(() => Math.random() - 0.5);
};
