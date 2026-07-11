import { useRef, useEffect } from 'react';
import type { KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';

interface OTPInputProps {
 otp: string[];
 onChange: (otp: string[]) => void;
 onSubmit?: () => void;
 disabled?: boolean;
}

export const OTPInput = ({ otp, onChange, onSubmit, disabled }: OTPInputProps) => {
 const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

 useEffect(() => {
 // Auto-focus first input on mount
 if (inputRefs.current[0] && !disabled) {
 inputRefs.current[0].focus();
 }
 }, [disabled]);

 const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
 const value = e.target.value;
 if (isNaN(Number(value))) return;

 const newOtp = [...otp];
 // Take only the last character in case they type multiple fast
 newOtp[index] = value.substring(value.length - 1);
 onChange(newOtp);

 // Auto-advance
 if (value && index < 5 && inputRefs.current[index + 1]) {
 inputRefs.current[index + 1]?.focus();
 }
 };

 const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
 if (e.key === 'Backspace') {
 if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
 // Move back if current is empty
 const newOtp = [...otp];
 newOtp[index - 1] = '';
 onChange(newOtp);
 inputRefs.current[index - 1]?.focus();
 } else {
 // Clear current
 const newOtp = [...otp];
 newOtp[index] = '';
 onChange(newOtp);
 }
 } else if (e.key === 'ArrowLeft' && index > 0) {
 inputRefs.current[index - 1]?.focus();
 } else if (e.key === 'ArrowRight' && index < 5) {
 inputRefs.current[index + 1]?.focus();
 } else if (e.key === 'Enter') {
 if (onSubmit && otp.every(digit => digit !== '')) {
 onSubmit();
 }
 }
 };

 const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
 e.preventDefault();
 const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
 if (pastedData) {
 const newOtp = [...otp];
 for (let i = 0; i < pastedData.length; i++) {
 newOtp[i] = pastedData[i];
 }
 onChange(newOtp);
 
 // Focus the next empty input or the last one
 const nextEmptyIndex = newOtp.findIndex(val => val === '');
 const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
 inputRefs.current[focusIndex]?.focus();
 }
 };

 return (
 <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
 {otp.map((digit, index) => (
 <Input
 key={index}
 ref={(el) => { inputRefs.current[index] = el; }}
 type="text"
 inputMode="numeric"
 maxLength={1}
 value={digit}
 onChange={(e) => handleChange(index, e)}
 onKeyDown={(e) => handleKeyDown(index, e)}
 disabled={disabled}
 className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-2xl border-border shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all bg-card"
 />
 ))}
 </div>
 );
};
