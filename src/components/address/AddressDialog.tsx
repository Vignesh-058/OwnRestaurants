import { useState } from 'react';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from "@/components/ui/dialog";
import { AddressForm } from './AddressForm';
import { useCreateAddress } from '@/hooks/mutations/useCreateAddress';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AddressDialog = () => {
 const [open, setOpen] = useState(false);
 const { mutate: createAddress, isPending } = useCreateAddress();

 const handleSubmit = (data: any) => {
 createAddress(data, {
 onSuccess: () => {
 setOpen(false);
 }
 });
 };

 return (
 <Dialog open={open} onOpenChange={setOpen}>
 <DialogTrigger asChild>
 <Button className="rounded-full shadow-premium flex items-center gap-2">
 <Plus className="h-4 w-4" />
 Add New Address
 </Button>
 </DialogTrigger>
 <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
 <DialogHeader className="mb-6">
 <DialogTitle className="text-2xl font-bold">Add New Address</DialogTitle>
 </DialogHeader>
 <AddressForm onSubmit={handleSubmit} isLoading={isPending} />
 </DialogContent>
 </Dialog>
 );
};
