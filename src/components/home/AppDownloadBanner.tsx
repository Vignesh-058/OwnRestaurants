import React from 'react';
import heroAppPromo from '@/assets/hero-app-promo.jpg';

export const AppDownloadBanner: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-border/40 bg-card">
        <img
          src={heroAppPromo}
          alt="OwnCart - Delicious Food, Delivered Your Way"
          className="w-full h-auto object-contain block"
          loading="lazy"
        />
      </div>
    </section>
  );
};
