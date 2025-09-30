import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import Residentes from './components/residents/Residentes';
import Vehiculos from './components/vehicles/Vehiculos';
import Visitantes from './components/visitors/Visitantes';
import Infracciones from './components/infractions/Infracciones';
import Camaras from './components/cameras/Camaras';
import Vision from './components/vision/Vision';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/residentes" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Residentes />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vehiculos" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Vehiculos />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/visitantes" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Visitantes />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/infracciones" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Infracciones />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/camaras" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Camaras />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vision" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Vision />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;