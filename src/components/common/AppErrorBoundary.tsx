import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props { children?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class AppErrorBoundary extends Component<Props, State> {
 public state: State = { hasError: false };

 public static getDerivedStateFromError(error: Error): State {
 return { hasError: true, error };
 }

 public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
 console.error('[AppErrorBoundary] Uncaught error:', error, errorInfo);
 }

 public render() {
 if (!this.state.hasError) return this.props.children;

 return (
 <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
 <div className="max-w-md w-full space-y-6">
 {/* Icon */}
 <div className="relative mx-auto h-24 w-24">
 <div className="h-24 w-24 rounded-full bg-red-50 flex items-center justify-center">
 <AlertTriangle className="h-12 w-12 text-red-500" />
 </div>
 <div className="absolute inset-0 rounded-full bg-red-100 opacity-30 animate-ping" />
 </div>

 {/* Copy */}
 <div>
 <h1 className="text-3xl font-black text-foreground mb-3">Application Error</h1>
 <p className="text-muted-foreground leading-relaxed">
 Something unexpected happened and the app crashed. This has been logged.
 </p>
 {this.state.error?.message && (
 <p className="mt-3 text-xs font-mono bg-muted/60 rounded-xl p-3 text-left text-muted-foreground border">
 {this.state.error.message}
 </p>
 )}
 </div>

 {/* Actions */}
 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <Button
 className="rounded-full gap-2 shadow-sm"
 onClick={() => window.location.reload()}
 >
 <RefreshCw className="h-4 w-4" />
 Reload App
 </Button>
 <Button
 variant="outline"
 className="rounded-full gap-2"
 onClick={() => { window.location.href = '/'; }}
 >
 <Home className="h-4 w-4" />
 Go Home
 </Button>
 </div>
 </div>
 </div>
 );
 }
}
