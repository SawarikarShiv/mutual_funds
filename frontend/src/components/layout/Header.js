import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">Infinity Mutual Funds</h1>
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search funds, schemes..."
            className="search-input"
          />
        </div>
      </div>
      
      <div className="header-right">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="profile-menu">
          <button 
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">
              <User size={18} />
            </div>
            <span className="profile-name">{user?.name || 'User'}</span>
            <ChevronDown size={16} />
          </button>
          
          {showProfileMenu && (
            <div className="dropdown-menu">
              <button 
                className="dropdown-item"
                onClick={() => navigate('/settings')}
              >
                Settings
              </button>
              <button 
                className="dropdown-item"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;