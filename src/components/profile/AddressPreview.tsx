import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Briefcase, Plus } from 'lucide-react';
import { useAddresses } from '@/hooks/queries/useAddresses';
import { Skeleton } from '@/components/ui/skeleton';

export const AddressPreview = () => {
  const { data: addresses, isLoading, isError, refetch } = useAddresses();

  const getIcon = (type: string) => {
    if (!type) return <MapPin className="w-5 h-5" />;
    switch (type.toLowerCase()) {
      case 'home': return <Home className="w-5 h-5" />;
      case 'work': return <Briefcase className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="rounded-3xl border-border/50 shadow-sm bg-card overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4 border-b border-border/50 px-6 sm:px-8 pt-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2].map(i => (
              <Card key={i} className="rounded-2xl border-border/50 shadow-sm bg-background">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="rounded-3xl border-border/50 shadow-sm bg-card overflow-hidden">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <p className="text-red-500 mb-4 font-medium">Failed to load addresses.</p>
          <Button onClick={() => refetch()} variant="outline">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-border/50 shadow-sm bg-card overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4 border-b border-border/50 px-6 sm:px-8 pt-8 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-[28px] font-bold text-foreground">Saved Addresses</CardTitle>
          <p className="text-sm font-medium text-muted-foreground mt-1">Your delivery locations</p>
        </div>
        <Button variant="ghost" className="hidden sm:flex text-primary font-bold hover:bg-primary/10 rounded-full" asChild>
          <Link to="/profile/addresses">Manage</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        {addresses && addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.slice(0, 3).map((address: any) => (
              <Card key={address._id} className="rounded-2xl border-border/50 hover:border-primary/30 transition-colors shadow-sm bg-background">
                <CardContent className="p-5 flex flex-col h-full relative">
                  {address.isDefault && (
                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">
                      Default
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {getIcon(address.type || address.addressType)}
                    </div>
                    <h4 className="text-[18px] font-semibold">{address.type || address.addressType || 'Address'}</h4>
                  </div>
                  
                  <div className="flex-1 space-y-1 text-sm text-muted-foreground font-medium mb-6">
                    <p className="text-foreground font-semibold">{address.address1 || address.address}</p>
                    <p>{address.city}, {address.state}</p>
                    <p>{address.pincode}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No saved addresses</h3>
            <p className="text-muted-foreground font-medium mb-6">Add a delivery address to checkout faster</p>
            <Button className="rounded-full px-8 font-bold shadow-premium" asChild>
              <Link to="/profile/addresses">
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Link>
            </Button>
          </div>
        )}
        
        {addresses && addresses.length > 0 && (
          <Button variant="outline" className="w-full mt-6 rounded-2xl h-12 font-bold sm:hidden border-border/50" asChild>
            <Link to="/profile/addresses">Manage Addresses</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
