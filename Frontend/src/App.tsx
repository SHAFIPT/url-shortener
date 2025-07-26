// App.tsx
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/routes';

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '',
          style: {
            border: '1px solid #3b82f6',
            padding: '12px',
            color: '#333',
          },
        }}
      />
    </BrowserRouter>
  );
}
