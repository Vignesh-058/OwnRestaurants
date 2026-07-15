import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CustomerReviews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Food Enthusiast',
      avatar: 'SJ',
      rating: 5,
      text: 'The quality of food is absolutely outstanding! Fast delivery and everything arrived piping hot. Highly recommended!',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Regular Customer',
      avatar: 'MC',
      rating: 5,
      text: 'Best restaurant in town. Their signature pizzas are to die for. Always my go-to place for weekend dinners.',
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'Local Guide',
      avatar: 'ED',
      rating: 4,
      text: 'Great ambiance when dining in, but their delivery service is equally impressive. Secure packaging and great taste.',
    },
    {
      id: 4,
      name: 'James Wilson',
      role: 'Food Blogger',
      avatar: 'JW',
      rating: 5,
      text: 'Exceptional service and mouth-watering dishes. The truffle mushroom burger is a must-try for everyone!',
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F8FAFC] border-b border-[#E5E7EB] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-[#111827] tracking-tight mb-4 capitalize">
              What Our Customers Say
            </h2>
            <div className="w-24 h-1.5 bg-[#FF6B00] rounded-full mb-6" />
            <p className="text-[#64748B] text-lg font-medium max-w-2xl">
              Don't just take our word for it. Here's what our loyal customers have to say about their experience.
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => scroll('left')}
              className="w-14 h-14 bg-white rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#111827] hover:border-[#FF6B00] hover:text-[#FF6B00] hover:shadow-[0_8px_20px_rgba(255,107,0,0.15)] hover:-translate-y-1 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-14 h-14 bg-white rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#111827] hover:border-[#FF6B00] hover:text-[#FF6B00] hover:shadow-[0_8px_20px_rgba(255,107,0,0.15)] hover:-translate-y-1 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8 pt-4 -mx-6 px-6 md:mx-0 md:px-0"
        >
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="snap-center shrink-0 w-[300px] md:w-[400px] bg-white rounded-[32px] p-8 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 relative group"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-[#FF6B00]/10 group-hover:text-[#FF6B00]/20 transition-colors duration-300" />
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn("w-5 h-5", i < review.rating ? "fill-[#FFB800] text-[#FFB800]" : "fill-[#E5E7EB] text-[#E5E7EB]")} 
                  />
                ))}
              </div>
              
              <p className="text-[#475569] text-lg leading-relaxed mb-8 italic">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-[#FFF7ED] text-[#FF6B00] flex items-center justify-center font-black text-lg">
                  {review.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-[#111827]">{review.name}</h4>
                  <p className="text-[#94A3B8] text-sm font-medium">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
