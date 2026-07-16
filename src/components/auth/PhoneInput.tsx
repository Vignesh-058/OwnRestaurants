import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COUNTRIES = [
  { code: '+91', flag: '🇮🇳', name: 'India', abbr: 'IN' },
  { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates', abbr: 'AE' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia', abbr: 'SA' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar', abbr: 'QA' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait', abbr: 'KW' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore', abbr: 'SG' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia', abbr: 'MY' },
  { code: '+1', flag: '🇺🇸', name: 'United States', abbr: 'US' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom', abbr: 'UK' },
];

interface PhoneInputProps {
  phone: string;
  onChange: (value: string) => void;
  countryCode?: string;
  onCountryCodeChange?: (value: string) => void;
  disabled?: boolean;
}

export const PhoneInput = ({ phone, onChange, countryCode = '+91', onCountryCodeChange, disabled }: PhoneInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search) ||
    c.abbr.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside the input container
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 15);
    onChange(value);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-2 w-full relative"
      ref={containerRef}
    >
      <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
        Mobile Number
      </Label>
      <div 
        className="relative flex items-center w-full h-[56px] rounded-[16px] bg-foreground border border-white/10 shadow-sm hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300 group z-10"
      >
        
        <div 
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`flex items-center h-full px-4 border-r border-white/10 bg-foreground hover:bg-primary/5 transition-colors cursor-pointer select-none rounded-l-[16px] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <img 
            src={`https://flagcdn.com/w40/${selectedCountry.abbr.toLowerCase()}.png`} 
            alt={selectedCountry.name}
            className="w-6 h-auto mr-2.5 rounded-sm shadow-sm"
          />
          <span className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">{selectedCountry.code}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 ml-1.5 transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
        </div>

        {/* Input Area */}
        <div className="flex-1 flex items-center relative">
          <Phone className="w-[22px] h-[22px] text-slate-400 absolute left-4 group-focus-within:text-primary transition-colors" strokeWidth={1.75} />
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="Enter mobile number"
            value={phone}
            onChange={handleChange}
            disabled={disabled}
            aria-label="Mobile Number"
            className="flex-1 h-full border-0 bg-transparent pl-12 pr-4 text-[17px] font-semibold text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Dropdown Menu - Native Absolute Positioning */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-[calc(100%+8px)] left-0 w-full z-[9999] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[16px] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[300px]"
          >
              {/* Search Header */}
              <div className="px-3 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/60 rounded-xl h-10 px-3 transition-colors focus-within:bg-slate-100 dark:focus-within:bg-slate-800">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search country or code..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent border-0 pl-2.5 text-[15px] font-medium focus:ring-0 outline-none dark:text-white placeholder:text-slate-400 h-full"
                    autoFocus
                  />
                </div>
              </div>

              {/* Country List */}
              <div className="overflow-y-auto p-1.5 custom-scrollbar">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => {
                    const isSelected = countryCode === country.code;
                    return (
                      <div 
                        key={country.abbr}
                        onClick={() => {
                          if (onCountryCodeChange) onCountryCodeChange(country.code);
                          setIsOpen(false);
                          setSearch('');
                        }}
                        className={`flex items-center justify-between px-3 h-11 rounded-[12px] cursor-pointer transition-all duration-200 select-none group ${
                          isSelected 
                            ? 'bg-slate-100 dark:bg-slate-800' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://flagcdn.com/w40/${country.abbr.toLowerCase()}.png`} 
                            alt={country.name}
                            className="w-5 h-auto rounded-sm shadow-sm drop-shadow-sm"
                          />
                          <span className={`text-[15px] transition-colors ${isSelected ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                            {country.name}
                          </span>
                        </div>
                        <span className={`text-[14px] ${isSelected ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-500 dark:text-slate-400'}`}>
                          {country.code}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-[14px] text-slate-500 font-medium">
                    No countries found
                  </div>
                )}
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
