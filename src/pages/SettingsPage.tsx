import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, CircleHelp, Phone, Info, 
  FileText, ShieldCheck, Share2, Settings as SettingsIcon 
} from 'lucide-react';
import { toast } from 'sonner';

import { useOrganizationStore } from '@/store/OrganizationStore';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ContactUsPanel } from '@/components/settings/ContactUsPanel';
import { AboutUsPanel } from '@/components/settings/AboutUsPanel';
import { FaqPanel } from '@/components/settings/FaqPanel';
import { LegalDocument } from '@/components/settings/LegalDocument';

type ActivePanel = 'contact' | 'about' | 'faq' | 'privacy' | 'terms' | null;

export const SettingsPage = () => {
  const organization = useOrganizationStore((state) => state.organization);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: organization?.name || 'OwnCart',
      text: 'Check out this amazing app!',
      url: window.location.origin,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success('App link copied to clipboard!');
      }
    } catch (err) {
      console.warn('Share failed:', err);
    }
  };

  const menuItems = [
    {
      group: 'Help & Support',
      items: [
        { id: 'faq', icon: CircleHelp, title: 'FAQ', subtitle: 'Frequently Asked Questions', onClick: () => setActivePanel('faq') },
        { id: 'contact', icon: Phone, title: 'Contact Us', subtitle: 'Get in touch with support', onClick: () => setActivePanel('contact') },
      ]
    },
    {
      group: 'Legal',
      items: [
        { id: 'privacy', icon: ShieldCheck, title: 'Privacy Policy', subtitle: 'How we protect your data', onClick: () => setActivePanel('privacy') },
        { id: 'terms', icon: FileText, title: 'Terms & Conditions', subtitle: 'Rules and guidelines', onClick: () => setActivePanel('terms') },
      ]
    },
    {
      group: 'About',
      items: [
        { id: 'about', icon: Info, title: 'About Us', subtitle: 'Learn more about our company', onClick: () => setActivePanel('about') },
        { id: 'share', icon: Share2, title: 'Share App', subtitle: 'Share with your friends', onClick: handleShare },
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4 bg-card p-6 rounded-3xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-border">
            <div className="h-14 w-14 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center shrink-0">
              <SettingsIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">Settings & Help</h1>
              <p className="text-muted-foreground text-sm mt-1">Manage preferences and get support.</p>
            </div>
          </div>

          {/* Menu Groups */}
          <div className="space-y-6">
            {menuItems.map((group, gIdx) => (
              <div key={gIdx} className="space-y-3">
                <h3 className="px-4 text-xs font-black text-muted-foreground uppercase tracking-widest">
                  {group.group}
                </h3>
                <div className="bg-white rounded-3xl border border-[#FFE2CC] shadow-sm overflow-hidden divide-y divide-[#FFE2CC]">
                  {group.items.map((item, _iIdx) => (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#FAF8F5] transition-colors text-left group/btn"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-[#FAF8F5] group-hover/btn:bg-white group-hover/btn:shadow-sm border border-transparent group-hover/btn:border-[#FFE2CC] flex items-center justify-center transition-all">
                          <item.icon className="h-5 w-5 text-[#6B7280] group-hover/btn:text-[#FF6B00] transition-colors" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1F2937] text-sm sm:text-base">{item.title}</p>
                          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">{item.subtitle}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[#D1D5DB] group-hover/btn:text-[#FF6B00] group-hover/btn:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Version Info */}
          <div className="pt-8 pb-4 text-center">
            <h4 className="font-black text-[#1F2937]">{organization?.name || 'OwnCart'}</h4>
            <p className="text-sm text-[#6B7280] mt-1 font-medium">Version 2.1.0 (Build 42)</p>
          </div>
        </motion.div>
      </div>

      {/* Panels Dialog */}
      <Dialog open={activePanel !== null} onOpenChange={(open) => !open && setActivePanel(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-6 sm:p-10 border-[#FFE2CC] shadow-2xl">
          <AnimatePresence mode="wait">
            {activePanel === 'contact' && (
              <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ContactUsPanel organization={organization} />
              </motion.div>
            )}
            {activePanel === 'about' && (
              <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AboutUsPanel organization={organization} />
              </motion.div>
            )}
            {activePanel === 'faq' && (
              <motion.div key="faq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <FaqPanel />
              </motion.div>
            )}
            {activePanel === 'privacy' && (
              <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LegalDocument title="Privacy Policy" type="privacy" />
              </motion.div>
            )}
            {activePanel === 'terms' && (
              <motion.div key="terms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LegalDocument title="Terms & Conditions" type="terms" />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
};
