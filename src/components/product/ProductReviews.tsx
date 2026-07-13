import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  content: string;
}

const dummyReviews: Review[] = [
  {
    id: '1',
    author: 'Rahul Sharma',
    rating: 5,
    date: '2 days ago',
    content: 'Absolutely loved this! The taste was incredible and it arrived perfectly hot. Highly recommended for anyone craving something delicious.',
  },
  {
    id: '2',
    author: 'Priya Patel',
    rating: 4,
    date: '1 week ago',
    content: 'Great portion size and very flavorful. The packaging was neat. Will definitely order this again next time.',
  },
  {
    id: '3',
    author: 'Amit Kumar',
    rating: 5,
    date: '2 weeks ago',
    content: 'One of the best items on the menu. The quality of ingredients really shines through. Worth every penny!',
  },
];

export const ProductReviews = () => {
  return (
    <div className="space-y-6">
      {dummyReviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-black/[0.03]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={review.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {review.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-bold text-foreground text-sm">{review.author}</h4>
                <p className="text-xs text-muted-foreground font-medium">{review.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-bold">{review.rating}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            "{review.content}"
          </p>
        </motion.div>
      ))}
    </div>
  );
};
