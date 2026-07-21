import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

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
  <div className="text-center flex items-center justify-center h-5">
    <AnimatePresence mode="wait">
      {timeLeft > 0 ? (
        <motion.p 
          key="timer"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-[14.5px] font-medium text-muted-foreground dark:text-muted-foreground/80"
        >
          Resend code in <span className="font-bold text-foreground ">00:{timeLeft.toString().padStart(2, '0')}</span>
        </motion.p>
      ) : (
        <motion.p 
          key="resend"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-[14.5px] font-medium text-muted-foreground dark:text-muted-foreground/80 flex items-center gap-1.5"
        >
          Didn't receive the code?{' '}
          <Button 
            variant="link" 
            className="p-0 h-auto font-bold text-primary hover:text-orange-600 transition-colors" 
            onClick={handleResend}
            disabled={isSending}
          >
            Resend now
          </Button>
        </motion.p>
      )}
    </AnimatePresence>
  </div>
  );
};
