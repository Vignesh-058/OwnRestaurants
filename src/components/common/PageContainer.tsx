import { cn } from '@/lib/utils';

interface PageContainerProps {
 children: React.ReactNode;
 className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
 return (
 <div className={cn("container mx-auto px-4 md:px-6 py-8 md:py-12 min-h-[calc(100vh-14rem)]", className)}>
 {children}
 </div>
 );
};
