import { useOrganizationStore } from "@/store/OrganizationStore";
import { useAuthStore } from "@/store/AuthStore";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrentLocationButton } from './CurrentLocationButton';
import { Loader2 } from 'lucide-react';
import { locationService } from '@/services/location.service';
import { toast } from 'sonner';
import type { CreateAddressRequest } from '@/types/customer.types';
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form";

const addressSchema = z.object({
 customerName: z.string().min(2, 'Name is required'),
 addressLine1: z.string().min(5, 'Address is required'),
 addressLine2: z.string().optional(),
 city: z.string().min(2, 'City is required'),
 state: z.string().min(2, 'State is required'),
 country: z.string().min(1, 'Country is required'),
 pincode: z.string().min(6, 'Valid pincode is required').max(6),
 landmark: z.string().optional(),
 addressType: z.enum(['Home', 'Work', 'Other']),
 latitude: z.number().optional(),
 longitude: z.number().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSubmit: (data: CreateAddressRequest) => void;
  isLoading?: boolean;
}

export const AddressForm = ({ onSubmit, isLoading }: AddressFormProps) => {
  const [isGeocoding, setIsGeocoding] = React.useState(false);
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema) as any,
    defaultValues: {
      customerName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      landmark: '',
      addressType: 'Home',
    },
  });

  const handleLocationFound = async (lat: number, lng: number) => {
    form.setValue('latitude', lat);
    form.setValue('longitude', lng);
    
    setIsGeocoding(true);
    try {
      // Use getCustomerGeoLocation per requirements to reverse geocode
      const response = await locationService.getCustomerGeoLocation({ lat, lng });
      
      if (response) {
        if (response.formattedAddress) {
          form.setValue('addressLine1', response.formattedAddress.split(',')[0] || response.formattedAddress);
          form.setValue('addressLine2', response.formattedAddress.split(',').slice(1).join(',').trim());
        }
        if (response.city) form.setValue('city', response.city);
        if (response.state) form.setValue('state', response.state);
        if (response.country) form.setValue('country', response.country);
        if (response.postalCode) form.setValue('pincode', response.postalCode);
        
        toast.success('Address auto-filled from location');
      }
    } catch (error) {
      console.error('[AddressForm] Reverse Geocoding failed:', error);
      toast.error('Failed to auto-fill address from location');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = (data: AddressFormValues) => {
    onSubmit({
      address1: data.addressLine1,
      address2: data.addressLine2 || '',
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      landMark: data.landmark || '',
      type: data.addressType.toLowerCase() as any,
      belongsTo: useOrganizationStore.getState().organization?._id || "",
      customerPhoneNo: useAuthStore.getState().user?.phone || "",
    });
  };

 return (
 <Form {...form}>
 <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
 <div className="mb-4">
 <CurrentLocationButton onLocationFound={handleLocationFound} />
        {isGeocoding && <p className="text-xs text-blue-600 mt-2 font-medium">Fetching address details...</p>}
 {form.watch('latitude') && form.watch('longitude') && (
 <p className="text-xs text-green-600 mt-2 font-medium">
 ✓ Location coordinates captured successfully
 </p>
 )}
 </div>

 <div className="grid grid-cols-1 gap-6">
 <FormField
 control={form.control}
 name="customerName"
 render={({ field }: { field: any }) => (
 <FormItem>
 <FormLabel>Full Name</FormLabel>
 <FormControl>
 <Input placeholder="John Doe" className="rounded-xl h-12" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="addressLine1"
 render={({ field }: { field: any }) => (
 <FormItem>
 <FormLabel>Flat, House no., Building, Company, Apartment</FormLabel>
 <FormControl>
 <Input className="rounded-xl h-12" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="addressLine2"
 render={({ field }: { field: any }) => (
 <FormItem>
 <FormLabel>Area, Street, Sector, Village (Optional)</FormLabel>
 <FormControl>
 <Input className="rounded-xl h-12" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <div className="grid grid-cols-2 gap-4">
 <FormField
 control={form.control}
 name="city"
 render={({ field }: { field: any }) => (
 <FormItem>
 <FormLabel>Town/City</FormLabel>
 <FormControl>
 <Input className="rounded-xl h-12" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <FormField
 control={form.control}
 name="pincode"
 render={({ field }: { field: any }) => (
 <FormItem>
 <FormLabel>Pincode</FormLabel>
 <FormControl>
 <Input className="rounded-xl h-12" maxLength={6} placeholder="6 digits" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </div>

 <div className="grid grid-cols-2 gap-4">
 <FormField
 control={form.control}
 name="state"
 render={({ field }: { field: any }) => (
 <FormItem>
 <FormLabel>State</FormLabel>
 <FormControl>
 <Input className="rounded-xl h-12" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <FormField
 control={form.control}
 name="country"
 render={({ field }: { field: any }) => (
 <FormItem>
 <FormLabel>Country</FormLabel>
 <FormControl>
 <Input className="rounded-xl h-12 bg-muted/50" disabled {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </div>

 <FormField
 control={form.control}
 name="landmark"
 render={({ field }: { field: any }) => (
 <FormItem>
 <FormLabel>Landmark (Optional)</FormLabel>
 <FormControl>
 <Input placeholder="E.g. near Apollo Hospital" className="rounded-xl h-12" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="addressType"
 render={({ field }: { field: any }) => (
 <FormItem>
 <FormLabel>Address Type</FormLabel>
 <Select onValueChange={field.onChange} defaultValue={field.value}>
 <FormControl>
 <SelectTrigger className="rounded-xl h-12">
 <SelectValue placeholder="Select a type" />
 </SelectTrigger>
 </FormControl>
 <SelectContent className="rounded-2xl">
 <SelectItem value="Home" className="rounded-xl my-1">Home (7 am - 9 pm delivery)</SelectItem>
 <SelectItem value="Work" className="rounded-xl my-1">Office/Commercial (10 am - 6 pm delivery)</SelectItem>
 <SelectItem value="Other" className="rounded-xl my-1">Other</SelectItem>
 </SelectContent>
 </Select>
 <FormMessage />
 </FormItem>
 )}
 />

 </div>

 <Button 
 type="submit" 
 className="w-full rounded-xl h-12 shadow-premium font-bold text-base" 
 disabled={isLoading}
 >
 {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
 {isLoading ? 'Saving Address...' : 'Save Address'}
 </Button>
 </form>
 </Form>
 );
};
