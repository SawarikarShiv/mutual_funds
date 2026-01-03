import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  TrendingUp, 
  PieChart, 
  CreditCard, 
  FileText,
  Settings,
  Users,
  Shield
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Home' },
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/funds', icon: <TrendingUp size={20} />, label: 'Funds' },
    { path: '/portfolio', icon: <PieChart size={20} />, label: 'Portfolio' },
    { path: '/transactions', icon: <CreditCard size={20} />, label: 'Transactions' },
    { path: '/reports', icon: <FileText size={20} />, label: 'Reports' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', icon: <Shield size={20} />, label: 'Admin' });
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.icon}
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="user-name">{user?.name || 'User'}</p>
            <p className="user-email">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;