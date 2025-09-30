import React, { useState, useEffect } from 'react';
import { residentsService } from '../services/residentsService';
import { vehiclesService } from '../services/vehiclesService';
import { visitorsService } from '../services/visitorsService';
import { infractionsService } from '../services/infractionsService';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    residents: 0,
    vehicles: 0,
    visitors: 0,
    infractions: 0,
    activeVisits: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const [residentsData, vehiclesData, visitorsData, infractionsData] = await Promise.all([
        residentsService.getAll({ limit: 1 }),
        vehiclesService.getAll({ limit: 1 }),
        visitorsService.getAll({ limit: 1 }),
        infractionsService.getAll({ limit: 1 })
      ]);

      setStats({
        residents: Array.isArray(residentsData) ? residentsData.length : 0,
        vehicles: Array.isArray(vehiclesData) ? vehiclesData.length : 0,
        visitors: Array.isArray(visitorsData) ? visitorsData.length : 0,
        infractions: Array.isArray(infractionsData) ? infractionsData.length : 0,
        activeVisits: 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Residentes',
      value: stats.residents,
      color: 'blue',
      description: 'Total de residentes registrados'
    },
    {
      title: 'Vehículos',
      value: stats.vehicles,
      color: 'green',
      description: 'Vehículos en el sistema'
    },
    {
      title: 'Visitantes',
      value: stats.visitors,
      color: 'purple',
      description: 'Visitantes registrados'
    },
    {
      title: 'Infracciones',
      value: stats.infractions,
      color: 'red',
      description: 'Infracciones detectadas'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Cargando datos del sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Resumen del sistema de control vehicular</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className={`stat-card stat-card-${stat.color}`}>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
              <div className="stat-description">{stat.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="card">
            <h3>Actividad Reciente</h3>
            <p>Próximamente: Lista de actividades recientes del sistema</p>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="card">
            <h3>Estado del Sistema</h3>
            <div className="system-status">
              <div className="status-item">
                <span className="status-indicator status-active"></span>
                <span>Sistema de Cámaras</span>
              </div>
              <div className="status-item">
                <span className="status-indicator status-active"></span>
                <span>Base de Datos</span>
              </div>
              <div className="status-item">
                <span className="status-indicator status-active"></span>
                <span>API Principal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;