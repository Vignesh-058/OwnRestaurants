import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyCategoriesProps {
 onRefresh?: () => void;
}

export const EmptyCategories = ({ onRefresh }: EmptyCategoriesProps) => (
 <div className="flex flex-col items-center justify-center p-14 text-center rounded-3xl border-2 border-dashed bg-white/50">
 <div className="h-18 w-18 bg-primary/10 rounded-full flex items-center justify-center mb-6 p-5">
 <LayoutGrid className="h-10 w-10 text-primary" />
 </div>
 <h3 className="text-xl font-bold mb-2">No Categories Yet</h3>
 <p className="text-muted-foreground text-sm max-w-xs mb-6">
 Categories haven't been configured yet. Check back soon!
 </p>
 {onRefresh && (
 <Button variant="outline" className="rounded-full" onClick={onRefresh}>
 Refresh
 </Button>
 )}
 </div>
);
