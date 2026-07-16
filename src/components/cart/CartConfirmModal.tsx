import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ModalVariant = 'remove';

interface CartConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  variant: ModalVariant;
  itemName: string;
  isLoading?: boolean;
}

const config = {
  remove: {
    icon: <Trash2 className="w-6 h-6 text-destructive" />,
    iconBg: 'bg-red-50',
    title: 'Remove Item',
    description: (name: string) => (
      <>
        Are you sure you want to remove{' '}
        <span className="font-semibold text-foreground">"{name}"</span>{' '}
        from your cart?
      </>
    ),
    confirmLabel: 'Remove',
    confirmClass:
      'bg-destructive hover:bg-destructive text-white shadow-[0_4px_16px_rgba(185,28,28,0.25)] hover:shadow-[0_6px_20px_rgba(185,28,28,0.35)]',
  },
} satisfies Record<ModalVariant, {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: (name: string) => React.ReactNode;
  confirmLabel: string;
  confirmClass: string;
}>;

export const CartConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  variant,
  itemName,
  isLoading = false,
}: CartConfirmModalProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const cfg = config[variant];

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, isLoading, onClose]);

  // Focus Cancel button when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Safely manage an isolated portal container to prevent React 'removeChild' errors on document.body
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create an isolated div for this modal only
    const el = document.createElement('div');
    el.setAttribute('data-portal', 'cart-confirm-modal');
    document.body.appendChild(el);
    setPortalContainer(el);

    return () => {
      // Safely cleanup the isolated container during unmount
      if (el && el.parentNode === document.body) {
        document.body.removeChild(el);
      }
    };
  }, []);

  if (!portalContainer) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
            onClick={() => !isLoading && onClose()}
          />

          {/* ── Desktop: centered dialog / Mobile: bottom sheet ── */}

          {/* Desktop dialog */}
          <motion.div
            key="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="hidden sm:flex fixed inset-0 z-[201] items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-[460px] bg-white rounded-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.18)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <ModalContent
                cfg={cfg}
                itemName={itemName}
                isLoading={isLoading}
                cancelRef={cancelRef}
                onClose={onClose}
                onConfirm={onConfirm}
              />
            </div>
          </motion.div>

          {/* Mobile bottom sheet */}
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="sm:hidden fixed bottom-0 left-0 right-0 z-[201] bg-white rounded-t-[28px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            <ModalContent
              cfg={cfg}
              itemName={itemName}
              isLoading={isLoading}
              cancelRef={cancelRef}
              onClose={onClose}
              onConfirm={onConfirm}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    portalContainer,
  );
};

/* ─── Shared inner content ─────────────────────────────────────────── */
interface ContentProps {
  cfg: typeof config[ModalVariant];
  itemName: string;
  isLoading: boolean;
  cancelRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalContent = ({ cfg, itemName, isLoading, cancelRef, onClose, onConfirm }: ContentProps) => (
  <div className="p-6">
    {/* Header row */}
    <div className="flex items-start justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-full ${cfg.iconBg} flex items-center justify-center shrink-0`}>
          {cfg.icon}
        </div>
        <h2 id="confirm-modal-title" className="text-[18px] font-black text-foreground leading-tight">
          {cfg.title}
        </h2>
      </div>
      <button
        onClick={onClose}
        disabled={isLoading}
        className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>

    {/* Description */}
    <p className="text-[14px] text-muted-foreground leading-relaxed mb-7">
      {cfg.description(itemName)}
    </p>

    {/* Divider */}
    <div className="border-t border-muted mb-5" />

    {/* Buttons */}
    <div className="flex gap-3">
      <Button
        ref={cancelRef}
        variant="outline"
        className="flex-1 h-[48px] rounded-full text-[15px] font-bold border-2 border-border text-muted-foreground hover:bg-muted hover:border-border transition-all"
        onClick={onClose}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        className={`flex-1 h-[48px] rounded-full text-[15px] font-bold transition-all duration-200 hover:-translate-y-0.5 ${cfg.confirmClass}`}
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          cfg.confirmLabel
        )}
      </Button>
    </div>
  </div>
);
