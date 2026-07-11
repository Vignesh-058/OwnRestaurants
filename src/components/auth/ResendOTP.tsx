import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ResendOTPProps {
 onResend: () => void;
 isSending?: boolean;
}

export const ResendOTP = ({ onResend, isSending }: ResendOTPProps) => {
 const [timeLeft, setTimeLeft] = useState(30);

 useEffect(() => {
 if (timeLeft <= 0) return;

 const timer = setInterval(() => {
 setTimeLeft(prev => prev - 1);
 }, 1000);

 return () => clearInterval(timer);
 }, [timeLeft]);

 const handleResend = () => {
 onResend();
 setTimeLeft(30);
 };

 return (
 <div className="text-center mt-6">
 {timeLeft > 0 ? (
 <p className="text-sm font-medium text-muted-foreground">
 Resend code in <span className="font-bold text-foreground">00:{timeLeft.toString().padStart(2, '0')}</span>
 </p>
 ) : (
 <p className="text-sm font-medium text-muted-foreground">
 Didn't receive the code?{' '}
 <Button 
 variant="link" 
 className="p-0 h-auto font-bold text-primary hover:text-primary/80" 
 onClick={handleResend}
 disabled={isSending}
 >
 Resend now
 </Button>
 </p>
 )}
 </div>
 );
};
