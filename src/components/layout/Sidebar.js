import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MdDashboard, 
  MdPeople, 
  MdDirectionsCar, 
  MdPersonAdd, 
  MdWarning, 
  MdVideocam,
  MdVisibility
} from 'react-icons/md';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: MdDashboard
    },
    {
      path: '/residentes',
      name: 'Residentes',
      icon: MdPeople
    },
    {
      path: '/vehiculos',
      name: 'Vehículos',
      icon: MdDirectionsCar
    },
    {
      path: '/visitantes',
      name: 'Visitantes',
      icon: MdPersonAdd
    },
    {
      path: '/infracciones',
      name: 'Infracciones',
      icon: MdWarning
    },
    {
      path: '/camaras',
      name: 'Cámaras',
      icon: MdVideocam
    },
    {
      path: '/vision',
      name: 'Visión Artificial',
      icon: MdVisibility
    }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path} className="sidebar-item">
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <IconComponent className="sidebar-icon" size={20} />
                  <span className="sidebar-text">{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;