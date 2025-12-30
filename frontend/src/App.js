import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Theme
import infinityTheme from './theme/infinityTheme';

// Store
import store from './redux/store';

// Layout Components
import InfinityLayout from './components/layout/InfinityLayout';
import AuthLayout from './components/layout/AuthLayout';

// Infinity Pages
import InfinityLogin from './pages/auth/InfinityLogin';
import InfinityRegister from './pages/auth/InfinityRegister';
import InfinityDashboard from './pages/dashboard/InfinityDashboard';
import InfinityFundsExplorer from './pages/funds/InfinityFundsExplorer';
import InfinityPortfolio from './pages/portfolio/InfinityPortfolio';
import InfinityTransactions from './pages/transactions/InfinityTransactions';
import InfinitySIP from './pages/sip/InfinitySIP';
import InfinityProfile from './pages/profile/InfinityProfile';
import InfinitySettings from './pages/settings/InfinitySettings';

// Protected Route
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={infinityTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<InfinityLogin />} />
              <Route path="register" element={<InfinityRegister />} />
              <Route index element={<Navigate to="/auth/login" />} />
            </Route>

            {/* Infinity Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <InfinityLayout />
              </ProtectedRoute>
            }>
              <Route index element={<InfinityDashboard />} />
              <Route path="dashboard" element={<InfinityDashboard />} />
              <Route path="funds" element={<InfinityFundsExplorer />} />
              <Route path="portfolio" element={<InfinityPortfolio />} />
              <Route path="transactions" element={<InfinityTransactions />} />
              <Route path="sip" element={<InfinitySIP />} />
              <Route path="profile" element={<InfinityProfile />} />
              <Route path="settings" element={<InfinitySettings />} />
            </Route>

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </ThemeProvider>
    </Provider>
  );
}

export default App;