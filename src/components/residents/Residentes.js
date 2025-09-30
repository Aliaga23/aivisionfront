import React, { useState, useEffect } from 'react';
import { residentsService } from '../../services/residentsService';
import '../../styles/CrudStyles.css';

const Residentes = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [deletingResident, setDeletingResident] = useState(null);
  const [formData, setFormData] = useState({
    name_resident: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const data = await residentsService.getAll();
      setResidents(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      setError('Error al cargar residentes');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name_resident: '', email: '', phone: '', address: '' });
    setEditingResident(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResident) {
        await residentsService.update(editingResident.id_resident, formData);
      } else {
        await residentsService.create(formData);
      }
      resetForm();
      fetchResidents();
    } catch (error) {
      setError('Error al guardar residente');
    }
  };

  const handleEdit = (resident) => {
    setEditingResident(resident);
    setFormData({
      name_resident: resident.name_resident,
      email: resident.email,
      phone: resident.phone || '',
      address: resident.address || ''
    });
    setShowForm(true);
  };

  const handleDeleteClick = (resident) => {
    setDeletingResident(resident);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await residentsService.delete(deletingResident.id_resident);
      setShowDeleteModal(false);
      setDeletingResident(null);
      fetchResidents();
    } catch (error) {
      setError('Error al eliminar residente');
    }
  };

  if (loading) return <div className="loading-spinner">Cargando residentes...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Residentes</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Nuevo Residente
        </button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingResident ? 'Editar Residente' : 'Nuevo Residente'}
              </h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid two-cols">
                <div className="input-group">
                  <label className="input-label">Nombre *</label>
                  <input
                    type="text"
                    name="name_resident"
                    value={formData.name_resident}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    placeholder="Nombre completo del residente"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Teléfono</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Número de teléfono"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Dirección</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Dirección completa"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingResident ? 'Actualizar' : 'Crear'}
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
              ¿Estás seguro de que deseas eliminar al residente <strong>{deletingResident?.name_resident}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div className="confirm-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingResident(null);
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
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {residents.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="empty-state">
                    <p>No hay residentes registrados</p>
                  </div>
                </td>
              </tr>
            ) : (
              residents.map((resident) => (
                <tr key={resident.id_resident}>
                  <td>{resident.id_resident}</td>
                  <td>{resident.name_resident}</td>
                  <td>{resident.email}</td>
                  <td>{resident.phone || '-'}</td>
                  <td>{resident.address || '-'}</td>
                  <td>
                    <span className={`status-badge ${resident.active ? 'status-active' : 'status-inactive'}`}>
                      {resident.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{new Date(resident.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-sm btn-edit" onClick={() => handleEdit(resident)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-delete" onClick={() => handleDeleteClick(resident)}>
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

export default Residentes;