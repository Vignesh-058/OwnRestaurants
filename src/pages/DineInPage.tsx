import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, TableProperties, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

import { useOutletStore } from '@/store/OutletStore';
import { useCartStore } from '@/store/CartStore';
import { useTables } from '@/hooks/queries/useDineIn';
import { dineInService } from '@/services/dinein.service';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Table } from '@/types/dinein.types';

export const DineInPage = () => {
  const navigate = useNavigate();
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const setTableInfo = useCartStore((state) => state.setTableInfo);
  const setOrderType = useCartStore((state) => state.setOrderType);

  const { data: tables, isLoading, isError, refetch } = useTables(selectedOutlet?._id);

  const [tableNumber, setTableNumber] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Check if Dine-In is supported
  const isDineInSupported = selectedOutlet?.orderType?.some(
    (type) => type.toLowerCase() === 'dine in' || type.toLowerCase() === 'dinein' || type.toLowerCase() === 'dine-in'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!isDineInSupported) {
    return (
      <div className="bg-background min-h-screen py-20 px-4 flex flex-col items-center text-center">
        <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-6">
          <UtensilsCrossed className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-black text-foreground mb-2">Dine-In Unavailable</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Sorry, dine-in ordering is currently not supported at this location.
        </p>
        <Button onClick={() => navigate('/')} className="rounded-full px-8">
          Return Home
        </Button>
      </div>
    );
  }

  const handleTableSelection = async (tableNum: string) => {
    if (!tableNum.trim()) return;

    try {
      setIsValidating(true);
      const table = await dineInService.validateTable(selectedOutlet!._id, tableNum.trim());
      
      setTableInfo({ tableId: table._id, tableName: table.tableName });
      setOrderType('Dine In');
      toast.success(`Connected to ${table.tableName}`);
      
      // Navigate to products catalog implicitly passing orderType via Zustand later
      navigate('/products');
    } catch (err: any) {
      toast.error(err.message || 'Invalid table selected');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 bg-card p-6 rounded-3xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-border mb-8">
          <div className="h-14 w-14 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center shrink-0">
            <UtensilsCrossed className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Dine-In Ordering</h1>
            <p className="text-muted-foreground text-sm mt-1">Select your table to view the menu</p>
          </div>
        </div>

        {/* Manual Entry */}
        <Card className="rounded-3xl border-[#FFE2CC] shadow-sm mb-8 overflow-hidden">
          <CardContent className="p-6 sm:p-8 bg-gradient-to-br from-white to-[#FAF8F5]">
            <h3 className="font-bold text-[#1F2937] mb-4">Enter Table Number</h3>
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="e.g. 12"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="h-12 rounded-2xl bg-white focus-visible:ring-[#FF6B00]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTableSelection(tableNumber);
                }}
              />
              <Button 
                onClick={() => handleTableSelection(tableNumber)}
                disabled={isValidating || !tableNumber.trim()}
                className="h-12 px-8 rounded-2xl bg-[#FF6B00] hover:bg-[#E66000] text-white font-bold"
              >
                {isValidating ? <RefreshCw className="h-5 w-5 animate-spin" /> : 'Confirm'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Tables */}
        <div>
          <h3 className="font-bold text-[#1F2937] mb-4 px-2">Available Tables</h3>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center p-8 bg-red-50 rounded-3xl border border-red-100">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <p className="text-sm text-red-800 mb-4">Unable to load tables.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-full">
                Try Again
              </Button>
            </div>
          ) : !tables?.length ? (
            <div className="text-center p-8 bg-[#FAF8F5] rounded-3xl border border-[#FFE2CC]">
              <TableProperties className="h-8 w-8 text-[#6B7280] mx-auto mb-3" />
              <p className="text-sm text-[#6B7280]">No tables are currently available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {tables.map((table: Table) => (
                <button
                  key={table._id}
                  onClick={() => handleTableSelection(table.tableNumber)}
                  disabled={table.status !== 'AVAILABLE'}
                  className={`relative p-4 rounded-2xl border text-left transition-all ${
                    table.status === 'AVAILABLE'
                      ? 'bg-white border-[#FFE2CC] hover:border-[#FF6B00] hover:shadow-md cursor-pointer group'
                      : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <TableProperties className={`h-6 w-6 ${table.status === 'AVAILABLE' ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
                    <Badge variant={table.status === 'AVAILABLE' ? 'default' : 'secondary'} className={
                      table.status === 'AVAILABLE' ? 'bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20' : ''
                    }>
                      {table.status === 'AVAILABLE' ? 'Free' : 'In Use'}
                    </Badge>
                  </div>
                  <p className="font-bold text-[#1F2937]">{table.tableName}</p>
                  <p className="text-xs text-[#6B7280] mt-1">Capacity: {table.capacity || 4}</p>
                  
                  {table.status === 'AVAILABLE' && (
                    <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-5 w-5 text-[#FF6B00]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
