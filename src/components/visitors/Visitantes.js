import React, { useState, useEffect } from 'react';
import { visitorsService } from '../../services/visitorsService';
import '../../styles/CrudStyles.css';

const Visitantes = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVisitor, setCurrentVisitor] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, visitorId: null });
  const [formData, setFormData] = useState({
    name_visitor: '',
    document_id: ''
  });

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await visitorsService.getAll();
      setVisitors(response);
    } catch (err) {
      setError('Error al cargar visitantes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (visitor = null) => {
    setCurrentVisitor(visitor);
    setFormData(visitor ? {
      name_visitor: visitor.name_visitor || '',
      document_id: visitor.document_id || ''
    } : {
      name_visitor: '',
      document_id: ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentVisitor(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentVisitor) {
        await visitorsService.update(currentVisitor.id_visitor, formData);
      } else {
        await visitorsService.create(formData);
      }
      await fetchVisitors();
      closeModal();
    } catch (err) {
      setError('Error al guardar visitante');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (visitorId) => {
    try {
      await visitorsService.delete(visitorId);
      await fetchVisitors();
      setDeleteModal({ open: false, visitorId: null });
    } catch (err) {
      setError('Error al eliminar visitante');
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

  if (loading) return <div className="loading-spinner">Cargando visitantes...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Visitantes</h1>
        <button 
          onClick={() => openModal()} 
          className="btn btn-primary"
        >
          + Nuevo Visitante
        </button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="data-table">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Fecha Creación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor) => (
              <tr key={visitor.id_visitor}>
                <td>{visitor.name_visitor}</td>
                <td>{visitor.document_id}</td>
                <td>{formatDate(visitor.created_at)}</td>
                <td>
                  <span className={`status-badge ${visitor.active ? 'status-active' : 'status-inactive'}`}>
                    {visitor.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-sm btn-edit" onClick={() => openModal(visitor)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-delete" onClick={() => setDeleteModal({ open: true, visitorId: visitor.id_visitor })}>
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
                {currentVisitor ? 'Editar Visitante' : 'Nuevo Visitante'}
              </h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid two-cols">
                <div className="input-group">
                  <label className="input-label">Nombre del Visitante *</label>
                  <input
                    type="text"
                    name="name_visitor"
                    value={formData.name_visitor}
                    onChange={handleChange}
                    className="input-field"
                    required
                    placeholder="Nombre completo del visitante"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Documento de Identidad</label>
                  <input
                    type="text"
                    name="document_id"
                    value={formData.document_id}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Número de documento"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentVisitor ? 'Actualizar Visitante' : 'Crear Visitante'}
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
            <p>¿Estás seguro de que quieres eliminar este visitante?</p>
            <div className="modal-actions">
              <button 
                onClick={() => setDeleteModal({ open: false, visitorId: null })}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(deleteModal.visitorId)}
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

export default Visitantes;