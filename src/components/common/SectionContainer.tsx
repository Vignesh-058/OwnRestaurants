import { cn } from '@/lib/utils';

interface SectionContainerProps {
 children: React.ReactNode;
 className?: string;
 title?: string;
 description?: string;
}

export const SectionContainer = ({ children, className, title, description }: SectionContainerProps) => {
 return (
 <section className={cn("py-16 md:py-24 space-y-12", className)}>
 {(title || description) && (
 <div className="flex flex-col space-y-2 text-center md:text-left">
 {title && <h2 className="text-heading">{title}</h2>}
 {description && <p className="text-subtitle text-muted-foreground">{description}</p>}
 </div>
 )}
 {children}
 </section>
 );
};
