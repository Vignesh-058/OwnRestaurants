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

interface LogoutDialogProps {
 isOpen: boolean;
 onOpenChange: (open: boolean) => void;
 onConfirm: () => void;
}

export const LogoutDialog = ({ isOpen, onOpenChange, onConfirm }: LogoutDialogProps) => {
 return (
 <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
 <AlertDialogContent className="rounded-3xl max-w-sm">
 <AlertDialogHeader>
 <AlertDialogTitle>Sign Out</AlertDialogTitle>
 <AlertDialogDescription>
 Are you sure you want to sign out of your account? You will need to verify your phone number to sign back in.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter className="sm:space-x-4">
 <AlertDialogCancel className="rounded-full px-6 font-bold h-11 border-border">Cancel</AlertDialogCancel>
 <AlertDialogAction 
 onClick={onConfirm}
 className="rounded-full px-6 font-bold h-11 bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm"
 >
 Sign Out
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 );
};
