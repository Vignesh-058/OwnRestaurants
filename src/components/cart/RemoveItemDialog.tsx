import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RemoveItemDialogProps {
 isOpen: boolean;
 onOpenChange: (open: boolean) => void;
 onConfirm: () => void;
 itemName: string;
}

export const RemoveItemDialog = ({ isOpen, onOpenChange, onConfirm, itemName }: RemoveItemDialogProps) => {
 return (
 <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
 <AlertDialogContent className="rounded-3xl max-w-sm">
 <AlertDialogHeader>
 <AlertDialogTitle>Remove Item</AlertDialogTitle>
 <AlertDialogDescription>
 Are you sure you want to remove <span className="font-semibold text-foreground">{itemName}</span> from your cart?
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter className="sm:space-x-4">
 <AlertDialogCancel className="rounded-full px-6 font-bold h-11 border-border">Cancel</AlertDialogCancel>
 <AlertDialogAction 
 onClick={onConfirm}
 className="rounded-full px-6 font-bold h-11 bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm"
 >
 Remove
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 );
};
