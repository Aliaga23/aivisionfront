import React, { useState, useEffect } from 'react';
import { camerasService } from '../../services/camerasService';
import '../../styles/CrudStyles.css';

const Camaras = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [deletingCamera, setDeletingCamera] = useState(null);
  const [formData, setFormData] = useState({
    name_camera: '',
    location_camera: ''
  });

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      setLoading(true);
      const data = await camerasService.getAll();
      setCameras(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      setError('Error al cargar cámaras');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name_camera: '', location_camera: '' });
    setEditingCamera(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCamera) {
        await camerasService.update(editingCamera.id_camera, formData);
      } else {
        await camerasService.create(formData);
      }
      resetForm();
      fetchCameras();
    } catch (error) {
      setError('Error al guardar cámara');
    }
  };

  const handleEdit = (camera) => {
    setEditingCamera(camera);
    setFormData({
      name_camera: camera.name_camera,
      location_camera: camera.location_camera || ''
    });
    setShowForm(true);
  };

  const handleDeleteClick = (camera) => {
    setDeletingCamera(camera);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await camerasService.delete(deletingCamera.id_camera);
      setShowDeleteModal(false);
      setDeletingCamera(null);
      fetchCameras();
    } catch (error) {
      setError('Error al eliminar cámara');
    }
  };

  if (loading) return <div className="loading-spinner">Cargando cámaras...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Cámaras</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Nueva Cámara
        </button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingCamera ? 'Editar Cámara' : 'Nueva Cámara'}
              </h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">Nombre *</label>
                  <input
                    type="text"
                    name="name_camera"
                    value={formData.name_camera}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    placeholder="Nombre de la cámara"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Ubicación</label>
                  <input
                    type="text"
                    name="location_camera"
                    value={formData.location_camera}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Ubicación de la cámara"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCamera ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay confirm-modal">
          <div className="modal-content">
            <div className="confirm-icon">!</div>
            <h3 className="modal-title">Confirmar Eliminación</h3>
            <p className="confirm-message">
              ¿Estás seguro de que deseas eliminar la cámara <strong>{deletingCamera?.name_camera}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div className="confirm-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingCamera(null);
                }}
              >
                Cancelar
              </button>
              <button className="btn btn-delete" onClick={handleDeleteConfirm}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="data-table">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cameras.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <p>No hay cámaras registradas</p>
                  </div>
                </td>
              </tr>
            ) : (
              cameras.map((camera) => (
                <tr key={camera.id_camera}>
                  <td>{camera.id_camera}</td>
                  <td>{camera.name_camera}</td>
                  <td>{camera.location_camera || '-'}</td>
                  <td>
                    <span className={`status-badge ${camera.active ? 'status-active' : 'status-inactive'}`}>
                      {camera.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-sm btn-edit" onClick={() => handleEdit(camera)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-delete" onClick={() => handleDeleteClick(camera)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Camaras;