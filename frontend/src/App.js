import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Funds from './pages/Funds';
import Portfolio from './pages/Portfolio';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import KYCForm from './components/Auth/KYCForm';
import store from './redux/store';
import PrivateRoute from './utils/PrivateRoute';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/kyc" element={<KYCForm />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="dashboard" element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                  <Route path="funds" element={
                    <PrivateRoute>
                      <Funds />
                    </PrivateRoute>
                  } />
                  <Route path="portfolio" element={
                    <PrivateRoute>
                      <Portfolio />
                    </PrivateRoute>
                  } />
                  <Route path="transactions" element={
                    <PrivateRoute>
                      <Transactions />
                    </PrivateRoute>
                  } />
                  <Route path="reports" element={
                    <PrivateRoute>
                      <Reports />
                    </PrivateRoute>
                  } />
                  <Route path="settings" element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  } />
                  <Route path="admin" element={
                    <PrivateRoute adminOnly={true}>
                      <Admin />
                    </PrivateRoute>
                  } />
                </Route>
              </Routes>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;