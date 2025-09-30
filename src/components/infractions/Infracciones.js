import React, { useState, useEffect } from 'react';
import { infractionsService } from '../../services/infractionsService';
import '../../styles/CrudStyles.css';

const Infracciones = () => {
  const [infractions, setInfractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentInfraction, setCurrentInfraction] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, infractionId: null });
  const [formData, setFormData] = useState({
    description_event: '',
    datetime_infraction: '',
    vehicle_id: '',
    tipo_infraccion_id: ''
  });



  useEffect(() => {
    fetchInfractions();
  }, []);

  const fetchInfractions = async () => {
    try {
      setLoading(true);
      const response = await infractionsService.getAll();
      setInfractions(response);
    } catch (err) {
      setError('Error al cargar infracciones');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (infraction = null) => {
    setCurrentInfraction(infraction);
    setFormData(infraction ? {
      description_event: infraction.description_event || '',
      datetime_infraction: infraction.datetime_infraction || '',
      vehicle_id: infraction.vehicle_id || '',
      tipo_infraccion_id: infraction.tipo_infraccion_id || ''
    } : {
      description_event: '',
      datetime_infraction: '',
      vehicle_id: '',
      tipo_infraccion_id: ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentInfraction(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentInfraction) {
        await infractionsService.update(currentInfraction.id_infraction, formData);
      } else {
        await infractionsService.create(formData);
      }
      await fetchInfractions();
      closeModal();
    } catch (err) {
      setError('Error al guardar infracción');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (infractionId) => {
    try {
      await infractionsService.delete(infractionId);
      await fetchInfractions();
      setDeleteModal({ open: false, infractionId: null });
    } catch (err) {
      setError('Error al eliminar infracción');
      console.error('Error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };



  if (loading) return <div className="loading-spinner">Cargando infracciones...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Infracciones</h1>
        <button 
          onClick={() => openModal()} 
          className="btn btn-primary"
        >
          + Nueva Infracción
        </button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="data-table">
        <table className="table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Fecha Infracción</th>
              <th>Vehículo ID</th>
              <th>Tipo ID</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {infractions.map((infraction) => (
              <tr key={infraction.id_infraction}>
                <td>{infraction.description_event}</td>
                <td>{formatDate(infraction.datetime_infraction)}</td>
                <td>{infraction.vehicle_id}</td>
                <td>{infraction.tipo_infraccion_id}</td>
                <td>{formatDate(infraction.created_at)}</td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-sm btn-edit" onClick={() => openModal(infraction)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-delete" onClick={() => setDeleteModal({ open: true, infractionId: infraction.id_infraction })}>
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
                {currentInfraction ? 'Editar Infracción' : 'Nueva Infracción'}
              </h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Descripción del Evento</label>
                <textarea
                  name="description_event"
                  value={formData.description_event}
                  onChange={handleChange}
                  className="input-field"
                  rows={3}
                  placeholder="Descripción detallada de la infracción..."
                />
              </div>

              <div className="form-grid two-cols">
                <div className="input-group">
                  <label className="input-label">Fecha y Hora de la Infracción *</label>
                  <input
                    type="datetime-local"
                    name="datetime_infraction"
                    value={formData.datetime_infraction}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">ID del Vehículo *</label>
                  <input
                    type="number"
                    name="vehicle_id"
                    value={formData.vehicle_id}
                    onChange={handleChange}
                    className="input-field"
                    required
                    placeholder="ID del vehículo infractor"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">ID del Tipo de Infracción *</label>
                <input
                  type="number"
                  name="tipo_infraccion_id"
                  value={formData.tipo_infraccion_id}
                  onChange={handleChange}
                  className="input-field"
                  required
                  placeholder="ID del tipo de infracción"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentInfraction ? 'Actualizar Infracción' : 'Crear Infracción'}
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
            <p>¿Estás seguro de que quieres eliminar esta infracción?</p>
            <div className="modal-actions">
              <button 
                onClick={() => setDeleteModal({ open: false, infractionId: null })}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(deleteModal.infractionId)}
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

export default Infracciones;