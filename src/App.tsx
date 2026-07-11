import { AppProvider } from '@/components/providers/AppProvider';
import { AppRouter } from '@/routes';

function App() {
 return (
 <AppProvider>
 <AppRouter />
 </AppProvider>
 );
}

export default App;
