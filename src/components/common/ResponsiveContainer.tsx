
import { cn } from '@/utils/cn';

interface ResponsiveContainerProps {
 children: React.ReactNode;
 className?: string;
}

export const ResponsiveContainer = ({ children, className }: ResponsiveContainerProps) => {
 return (
 <div className={cn("w-full max-w-[1400px] mx-auto", className)}>
 {children}
 </div>
 );
};
