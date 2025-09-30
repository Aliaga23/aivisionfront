import React, { useState, useEffect } from 'react';
import { vehiclesService } from '../../services/vehiclesService';
import '../../styles/CrudStyles.css';

const Vehiculos = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, vehicleId: null });
  const [formData, setFormData] = useState({
    license_plate: '',
    brand: '',
    model: '',
    color: '',
    resident_id: '',
    visitor_id: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehiclesService.getAll();
      setVehicles(response);
    } catch (err) {
      setError('Error al cargar vehículos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (vehicle = null) => {
    setCurrentVehicle(vehicle);
    setFormData(vehicle ? {
      license_plate: vehicle.license_plate || '',
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      color: vehicle.color || '',
      resident_id: vehicle.resident_id || '',
      visitor_id: vehicle.visitor_id || ''
    } : {
      license_plate: '',
      brand: '',
      model: '',
      color: '',
      resident_id: '',
      visitor_id: ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentVehicle(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentVehicle) {
        await vehiclesService.update(currentVehicle.id_vehicle, formData);
      } else {
        await vehiclesService.create(formData);
      }
      await fetchVehicles();
      closeModal();
    } catch (err) {
      setError('Error al guardar vehículo');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (vehicleId) => {
    try {
      await vehiclesService.delete(vehicleId);
      await fetchVehicles();
      setDeleteModal({ open: false, vehicleId: null });
    } catch (err) {
      setError('Error al eliminar vehículo');
      console.error('Error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading-spinner">Cargando vehículos...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Vehículos</h1>
        <button 
          onClick={() => openModal()} 
          className="btn btn-primary"
        >
          + Nuevo Vehículo
        </button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="data-table">
        <table className="table">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Color</th>
              <th>Residente</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id_vehicle}>
                <td>{vehicle.license_plate}</td>
                <td>{vehicle.brand}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.color}</td>
                <td>{vehicle.resident_id}</td>
                <td>
                  <span className={`status-badge ${vehicle.active ? 'status-active' : 'status-inactive'}`}>
                    {vehicle.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-sm btn-edit" onClick={() => openModal(vehicle)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-delete" onClick={() => setDeleteModal({ open: true, vehicleId: vehicle.id_vehicle })}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {currentVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
              </h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid two-cols">
                <div className="input-group">
                  <label className="input-label">Placa *</label>
                  <input
                    type="text"
                    name="license_plate"
                    value={formData.license_plate}
                    onChange={handleChange}
                    className="input-field"
                    required
                    placeholder="Placa del vehículo"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Marca *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="input-field"
                    required
                    placeholder="Marca del vehículo"
                  />
                </div>
              </div>

              <div className="form-grid two-cols">
                <div className="input-group">
                  <label className="input-label">Modelo *</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="input-field"
                    required
                    placeholder="Modelo del vehículo"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Color *</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="input-field"
                    required
                    placeholder="Color del vehículo"
                  />
                </div>
              </div>

              <div className="form-grid two-cols">
                <div className="input-group">
                  <label className="input-label">ID del Residente</label>
                  <input
                    type="number"
                    name="resident_id"
                    value={formData.resident_id}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="ID del residente propietario"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">ID del Visitante</label>
                  <input
                    type="number"
                    name="visitor_id"
                    value={formData.visitor_id}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="ID del visitante (opcional)"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentVehicle ? 'Actualizar Vehículo' : 'Crear Vehículo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que quieres eliminar este vehículo?</p>
            <div className="modal-actions">
              <button 
                onClick={() => setDeleteModal({ open: false, vehicleId: null })}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(deleteModal.vehicleId)}
                className="btn btn-danger"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehiculos;