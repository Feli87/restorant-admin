import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { Toaster } from 'sonner';

export function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}
