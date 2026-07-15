import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

export const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <section className="py-20 md:py-28 bg-[#111827] relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute -top-[100px] -right-[100px] w-96 h-96 bg-[#FF6B00] rounded-full blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute -bottom-[100px] -left-[100px] w-96 h-96 bg-[#FF6B00] rounded-full blur-[150px] opacity-20 pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 md:p-16 lg:p-20 text-center max-w-4xl mx-auto shadow-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-[#FF6B00]/20 rounded-full flex items-center justify-center mb-8 border border-[#FF6B00]/30 shadow-[0_0_30px_rgba(255,107,0,0.2)]">
              <Mail className="w-10 h-10 text-[#FF6B00]" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
              Subscribe to Our Newsletter
            </h2>
            
            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl font-medium">
              Get the latest updates, exclusive offers, and special discounts directly in your inbox. No spam, we promise!
            </p>
            
            <form onSubmit={handleSubmit} className="w-full max-w-md relative flex items-center">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-6 py-5 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent pr-[140px] transition-all text-lg"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-[#FF6B00] text-white font-bold px-6 rounded-[18px] hover:bg-[#e66000] hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4 hidden sm:block" />
              </button>
            </form>
            
            <p className="text-white/40 text-sm mt-6">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
