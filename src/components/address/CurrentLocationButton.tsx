import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CurrentLocationButtonProps {
 onLocationFound: (lat: number, lng: number) => void;
}

export const CurrentLocationButton = ({ onLocationFound }: CurrentLocationButtonProps) => {
 const [isLoading, setIsLoading] = useState(false);

 const handleGetLocation = () => {
 if (!navigator.geolocation) {
 toast.error('Geolocation is not supported by your browser');
 return;
 }

 setIsLoading(true);
 navigator.geolocation.getCurrentPosition(
 (position) => {
 setIsLoading(false);
 onLocationFound(position.coords.latitude, position.coords.longitude);
 toast.success('Location detected successfully');
 },
 (error) => {
 setIsLoading(false);
 switch (error.code) {
 case error.PERMISSION_DENIED:
 toast.error('Location permission denied. Please enter manually.');
 break;
 case error.POSITION_UNAVAILABLE:
 toast.error('Location information is unavailable.');
 break;
 case error.TIMEOUT:
 toast.error('The request to get user location timed out.');
 break;
 default:
 toast.error('An unknown error occurred getting location.');
 break;
 }
 },
 {
 enableHighAccuracy: true,
 timeout: 10000,
 maximumAge: 0
 }
 );
 };

 return (
 <Button 
 type="button" 
 variant="outline" 
 className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary/5 gap-2"
 onClick={handleGetLocation}
 disabled={isLoading}
 >
 {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
 {isLoading ? 'Detecting Location...' : 'Use Current Location'}
 </Button>
 );
};
