import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 X, MapPin, Search, Navigation, Home, Briefcase, Clock, Map, Loader2 
} from 'lucide-react';
import { useLocationStore } from '@/store/LocationStore';
import { useLocationModalStore } from '@/store/LocationModalStore';
import { useOutletStore } from '@/store/OutletStore';
import { toast } from 'sonner';

// Mock geocoding directory matching sample backend locations
const MOCK_LOCATIONS = [
 { city: 'Anna nagar, Chennai', address: 'Anna Nagar West, Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707 },
 { city: 'Noida, Sector 62', address: 'Sector 62, Noida, Uttar Pradesh', lat: 28.5355, lng: 77.3910 },
 { city: 'Cyber City, Gurugram', address: 'Cyber City, DLF Phase 2, Gurugram, Haryana', lat: 28.4595, lng: 77.0266 },
 { city: 'Mumbai Central', address: 'Mumbai Central Station, Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777 },
 { city: 'Connaught Place, Delhi', address: 'Rajiv Chowk, Connaught Place, New Delhi, Delhi', lat: 28.7041, lng: 77.1025 },
];

export const LocationSelectorModal = () => {
 const { isOpen, closeModal } = useLocationModalStore();
 const { setLocation } = useLocationStore();
 const setSelectedOutlet = useOutletStore((state) => state.setSelectedOutlet);

 const [searchQuery, setSearchQuery] = useState('');
 const [isLocating, setIsLocating] = useState(false);
 const [recentAddresses, setRecentAddresses] = useState<typeof MOCK_LOCATIONS>([]);

 // Load recent addresses from localStorage on mount
 useEffect(() => {
 const saved = localStorage.getItem('recent_addresses');
 if (saved) {
 try {
 setRecentAddresses(JSON.parse(saved));
 } catch (e) {
 console.error(e);
 }
 }
 }, [isOpen]);

 const saveToRecent = (loc: typeof MOCK_LOCATIONS[0]) => {
 const updated = [loc, ...recentAddresses.filter(r => r.address !== loc.address)].slice(0, 5);
 setRecentAddresses(updated);
 localStorage.setItem('recent_addresses', JSON.stringify(updated));
 };

 const handleSelectLocation = (lat: number, lng: number, address: string) => {
 // Clear previously selected outlet so nearby query forces a clean re-fetch and auto-selection
 setSelectedOutlet(null as any);
 
 // Set new location in store
 setLocation(lat, lng, address);
 toast.success(`Location set to: ${address}`);
 
 // Save to recents if not already there
 const matchedMock = MOCK_LOCATIONS.find(m => m.address === address);
 if (matchedMock) {
 saveToRecent(matchedMock);
 } else {
 saveToRecent({ city: address.split(',')[0], address, lat, lng });
 }

 closeModal();
 };

 const handleUseCurrentLocation = () => {
 if (!navigator.geolocation) {
 toast.error('Geolocation is not supported by your browser.');
 return;
 }

 setIsLocating(true);
 navigator.geolocation.getCurrentPosition(
 (position) => {
 const { latitude, longitude } = position.coords;
 // Mock a friendly address label for raw GPS coordinates
 const address = `GPS Position (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`;
 handleSelectLocation(latitude, longitude, address);
 setIsLocating(false);
 },
 (error) => {
 console.error('Error fetching GPS position:', error);
 setIsLocating(false);
 toast.error('Unable to fetch GPS location. Please choose manually.');
 },
 { enableHighAccuracy: true, timeout: 8000 }
 );
 };

 // Filter list of locations based on user search
 const filteredMockLocations = MOCK_LOCATIONS.filter(loc => 
 loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
 loc.address.toLowerCase().includes(searchQuery.toLowerCase())
 );

 if (!isOpen) return null;

 return (
 <AnimatePresence>
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 {/* Dark overlay with blur */}
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={closeModal}
 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
 />

 {/* Modal content container */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 30 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 30 }}
 transition={{ type: 'spring', stiffness: 350, damping: 30 }}
 className="bg-background dark:bg-slate-900 border border-border dark:border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10"
 >
 {/* Header */}
 <div className="p-6 border-b border-border/60 flex items-center justify-between">
 <div>
 <h2 className="text-xl font-black text-foreground">Choose Delivery Location</h2>
 <p className="text-xs text-muted-foreground mt-1">Select where you want your food delivered</p>
 </div>
 <button 
 onClick={closeModal}
 className="h-10 w-10 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-none">
 
 {/* Search Input */}
 <div className="relative flex items-center">
 <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
 <input 
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search for street, area, city..."
 className="w-full h-14 pl-12 pr-4 bg-muted/65 dark:bg-white/5 border border-border/80 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground"
 />
 </div>

 {/* Core Action: Use GPS Location */}
 <button 
 onClick={handleUseCurrentLocation}
 disabled={isLocating}
 className="w-full h-14 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 hover:border-transparent rounded-2xl flex items-center justify-between px-5 transition-all duration-300 font-extrabold text-sm shadow-sm group disabled:opacity-75"
 >
 <div className="flex items-center gap-3">
 {isLocating ? (
 <Loader2 className="h-5 w-5 animate-spin" />
 ) : (
 <Navigation className="h-5 w-5 stroke-[2.5] group-hover:animate-pulse" />
 )}
 <span>{isLocating ? 'Locating...' : 'Use Current GPS Location'}</span>
 </div>
 <span className="text-xs font-black opacity-80 group-hover:translate-x-1 transition-transform">GPS</span>
 </button>

 {/* Results or Sections */}
 {searchQuery.trim().length > 0 ? (
 <div className="space-y-3">
 <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">Search Results</h3>
 <div className="space-y-1">
 {filteredMockLocations.length > 0 ? (
 filteredMockLocations.map((loc, idx) => (
 <button 
 key={idx}
 onClick={() => handleSelectLocation(loc.lat, loc.lng, loc.address)}
 className="w-full text-left p-3.5 hover:bg-muted/80 rounded-2xl transition-all border border-transparent hover:border-border/60 flex items-start gap-3.5"
 >
 <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
 <div>
 <span className="font-extrabold text-sm text-foreground block leading-tight">{loc.city}</span>
 <span className="text-xs text-muted-foreground block mt-1">{loc.address}</span>
 </div>
 </button>
 ))
 ) : (
 <div className="text-center py-8 text-sm text-muted-foreground">
 No matching addresses found. Try "Noida", "Chennai", or "Delhi".
 </div>
 )}
 </div>
 </div>
 ) : (
 <>
 {/* Saved Locations */}
 <div className="space-y-3">
 <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">Saved Addresses</h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <button 
 onClick={() => handleSelectLocation(28.5355, 77.3910, 'Sector 62, Noida, Uttar Pradesh')}
 className="text-left p-4 bg-muted/40 hover:bg-muted rounded-2xl transition-all border border-border/50 flex items-center gap-3.5"
 >
 <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
 <Home className="h-5 w-5 text-primary" />
 </div>
 <div>
 <span className="font-extrabold text-sm text-foreground block leading-tight">Home</span>
 <span className="text-[10px] text-muted-foreground block mt-0.5">Noida Sector 62</span>
 </div>
 </button>

 <button 
 onClick={() => handleSelectLocation(28.4595, 77.0266, 'Cyber City, DLF Phase 2, Gurugram, Haryana')}
 className="text-left p-4 bg-muted/40 hover:bg-muted rounded-2xl transition-all border border-border/50 flex items-center gap-3.5"
 >
 <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
 <Briefcase className="h-5 w-5 text-blue-500" />
 </div>
 <div>
 <span className="font-extrabold text-sm text-foreground block leading-tight">Work</span>
 <span className="text-[10px] text-muted-foreground block mt-0.5">Cyber City, Gurugram</span>
 </div>
 </button>
 </div>
 </div>

 {/* Recent Searches */}
 {recentAddresses.length > 0 && (
 <div className="space-y-3">
 <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">Recent Searches</h3>
 <div className="space-y-1">
 {recentAddresses.map((loc, idx) => (
 <button 
 key={idx}
 onClick={() => handleSelectLocation(loc.lat, loc.lng, loc.address)}
 className="w-full text-left p-3 hover:bg-muted/80 rounded-xl transition-all flex items-center gap-3"
 >
 <Clock className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
 <div className="flex-1 min-w-0">
 <span className="font-bold text-xs text-foreground block truncate">{loc.city}</span>
 <span className="text-[10px] text-muted-foreground block truncate mt-0.5">{loc.address}</span>
 </div>
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Pick on Map */}
 <button 
 onClick={() => {
 // Simulating a map picking flow by selecting Connaught Place Delhi
 handleSelectLocation(28.7041, 77.1025, 'Rajiv Chowk, Connaught Place, New Delhi, Delhi');
 toast.info('Selected location on Map');
 }}
 className="w-full h-12 bg-muted/50 hover:bg-muted border border-border/40 rounded-2xl flex items-center justify-center gap-2 transition-all text-xs font-extrabold text-muted-foreground hover:text-foreground"
 >
 <Map className="h-4 w-4" />
 <span>Choose Location from Map Marker</span>
 </button>
 </>
 )}
 
 </div>
 </motion.div>
 </div>
 </AnimatePresence>
 );
};
