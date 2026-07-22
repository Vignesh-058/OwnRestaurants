import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { ShoppingBag } from 'lucide-react';

interface ReplaceCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPreOrderToPreOrder?: boolean;
}

export const ReplaceCartModal: React.FC<ReplaceCartModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isPreOrderToPreOrder = false,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-[420px] rounded-3xl p-6 border border-border bg-background shadow-2xl backdrop-blur-md">
        <AlertDialogHeader className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-500 flex items-center justify-center shrink-0 mb-1">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <AlertDialogTitle className="text-xl font-bold text-foreground tracking-tight">
            Replace Existing Cart?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed pt-1">
            {isPreOrderToPreOrder ? (
              <>
                Your cart contains items from another pre-order.
                <br /><br />
                Continuing will remove the existing pre-order items and start a new pre-order.
                <br /><br />
                Do you want to continue?
              </>
            ) : (
              <>
                Your cart already contains products from a regular order.
                <br /><br />
                To continue with this pre-order, your current cart items will be removed.
                <br /><br />
                Do you want to continue?
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-6">
          <AlertDialogCancel
            onClick={onClose}
            className="w-full sm:flex-1 h-11 rounded-xl border-border font-semibold text-sm hover:bg-muted transition-all"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md shadow-primary/20 transition-all"
          >
            Replace Cart
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
