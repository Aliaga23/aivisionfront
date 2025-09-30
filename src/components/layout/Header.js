import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Vision Artificial</h1>
          <span className="header-subtitle">Sistema de Control Vehicular</span>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.name_user}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-outline logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;