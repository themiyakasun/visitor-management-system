import { RouterProvider } from 'react-router';
import router from './routes/router';
import { useAuthStore } from './stores/authStore';
import { useEffect } from 'react';
import { authService } from './services/auth-services';

const App = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    authService.initializeToken();

    initializeAuth();
  }, [initializeAuth]);

  return <RouterProvider router={router} />;
};

export default App;
