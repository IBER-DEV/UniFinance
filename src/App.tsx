import React from 'react';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Savings from './pages/Saving';
import AuthForm from './components/Auth/AuthForm';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Reports from './pages/Reports';
import { Analytics } from '@vercel/analytics/react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'income', element: <Income /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'savings', element: <Savings /> },
      {path: 'reports', element: <Reports/>,},
    ],
  },
]);

function App() {
  return (
    <><AuthProvider>
      <ThemeProvider>
        <AuthenticatedApp />
      </ThemeProvider>
    </AuthProvider>
    <Analytics />
    </>
    
  );
}

const AuthenticatedApp: React.FC = () => {
  const { session } = useAuth();

  if (!session) {
    return <AuthForm />;
  }

  return <RouterProvider router={router} />;
};

export default App;