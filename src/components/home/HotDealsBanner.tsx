import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HotDealsBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-6 md:py-10 bg-background border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-12">
        <div className="w-full rounded-[24px] bg-[#FFF8F0] border border-blue-100/50 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-col text-center md:text-left">
            <h2 className="text-[22px] md:text-[28px] font-black text-[#FF6B00] tracking-tight mb-1.5 md:mb-2">
              Hot Deals!
            </h2>
            <p className="text-[#1e1b4b] text-[16px] md:text-[20px] font-bold">
              Up to 40% OFF on selected items this week.
            </p>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById('offers');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else navigate('/products');
            }}
            className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-8 py-3.5 rounded-full font-bold text-[15px] transition-colors shadow-sm whitespace-nowrap w-full md:w-auto"
          >
            View Offers
          </button>
        </div>
      </div>
    </section>
  );
};
