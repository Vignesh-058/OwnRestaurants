import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransition = ({ children }: { children: ReactNode }) => {
 const location = useLocation();

 return (
 <motion.div
 key={location.pathname}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
 exit={{ opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } }}
 className="h-full w-full"
 >
 {children}
 </motion.div>
 );
};
