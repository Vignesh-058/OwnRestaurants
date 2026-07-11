import { cn } from '@/lib/utils';

interface ContentContainerProps {
 children: React.ReactNode;
 className?: string;
}

export const ContentContainer = ({ children, className }: ContentContainerProps) => {
 return (
 <div className={cn("max-w-5xl mx-auto w-full", className)}>
 {children}
 </div>
 );
};
