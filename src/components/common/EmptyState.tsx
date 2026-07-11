
import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
 className?: string;
 title?: string;
 description?: string;
 icon?: React.ReactNode;
 action?: React.ReactNode;
}

export const EmptyState = ({ className, title = "No Results Found", description, icon, action }: EmptyStateProps) => {
 return (
 <div className={cn("flex flex-col items-center justify-center p-12 text-center space-y-4", className)}>
 <div className="bg-muted p-4 rounded-full">
 {icon || <Inbox className="w-8 h-8 text-muted-foreground" />}
 </div>
 <div className="space-y-1">
 <h3 className="font-semibold text-lg">{title}</h3>
 {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
 </div>
 {action && <div className="pt-2">{action}</div>}
 </div>
 );
};
