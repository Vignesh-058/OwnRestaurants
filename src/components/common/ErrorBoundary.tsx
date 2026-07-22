import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
 children?: ReactNode;
}

interface State {
 hasError: boolean;
 error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
 public state: State = {
 hasError: false
 };

 public static getDerivedStateFromError(error: Error): State {
 return { hasError: true, error };
 }

 public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
 console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
 }

 public render() {
 if (this.state.hasError) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
 <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
 <h2 className="text-xl font-bold tracking-tight mb-2">Something went wrong</h2>
 <p className="text-muted-foreground mb-4 max-w-md">
 We encountered an unexpected error while rendering this page.
 </p>
 {this.state.error && (
 <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-left max-w-lg overflow-auto text-xs font-mono text-destructive">
 <p className="font-bold mb-1">{this.state.error.name}: {this.state.error.message}</p>
 {this.state.error.stack && (
 <pre className="whitespace-pre-wrap text-[11px] text-muted-foreground mt-2">{this.state.error.stack}</pre>
 )}
 </div>
 )}
 <Button onClick={() => window.location.reload()}>
 Reload Page
 </Button>
 </div>
 );
 }

 return this.props.children;
 }
}
