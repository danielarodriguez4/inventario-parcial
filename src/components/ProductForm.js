import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductForm.css';
import { API_ROUTES } from '../services/api';

const ProductForm = () => {
  const [almacenes, setAlmacenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    cantidadStock: '',
    cantidadMinima: '',
    cantidadMaxima: '',
    categoria: '',
    unidadMedida: '',
    fechaVencimiento: '',
    almacenId: ''
  });

  // Cargar almacenes al montar el componente
  useEffect(() => {
    const fetchAlmacenes = async () => {
      try {
        const response = await axios.get(API_ROUTES.LISTAR_ALMACENES);
        setAlmacenes(response.data);
      } catch (err) {
        setMessage({ type: 'error', text: 'Error al cargar los almacenes' });
        console.error(err);
      }
    };
    fetchAlmacenes();
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar formulario
  const validateForm = () => {
    const errors = [];
    
    if (!formData.codigo.trim()) errors.push('El código es obligatorio');
    if (!formData.nombre.trim()) errors.push('El nombre es obligatorio');
    if (!formData.precio || parseFloat(formData.precio) <= 0) errors.push('El precio debe ser mayor a 0');
    if (!formData.cantidadStock || parseInt(formData.cantidadStock) < 0) errors.push('La cantidad en stock no puede ser negativa');
    if (!formData.almacenId) errors.push('Debe seleccionar un almacén');
    
    if (formData.cantidadMinima && parseInt(formData.cantidadMinima) < 0) {
      errors.push('La cantidad mínima no puede ser negativa');
    }
    
    if (formData.cantidadMaxima && parseInt(formData.cantidadMaxima) < 0) {
      errors.push('La cantidad máxima no puede ser negativa');
    }
    
    if (formData.cantidadMinima && formData.cantidadMaxima) {
      if (parseInt(formData.cantidadMinima) > parseInt(formData.cantidadMaxima)) {
        errors.push('La cantidad mínima no puede ser mayor que la máxima');
      }
    }

    return errors;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setMessage({ type: 'error', text: errors.join(', ') });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Preparar datos para envío
        const productData = {
        codigo: formData.codigo.trim(),
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        precio: parseFloat(formData.precio),
        cantidadStock: parseInt(formData.cantidadStock),
        cantidadMinima: formData.cantidadMinima ? parseInt(formData.cantidadMinima) : 0,
        cantidadMaxima: formData.cantidadMaxima ? parseInt(formData.cantidadMaxima) : null,
        categoria: formData.categoria.trim() || null,
        unidadMedida: formData.unidadMedida.trim() || null,
        almacenId: parseInt(formData.almacenId)
        };


      await axios.post(API_ROUTES.CREAR_PRODUCTO, productData);
      
      setMessage({ type: 'success', text: 'Producto agregado exitosamente' });
      
      // Limpiar formulario
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        precio: '',
        cantidadStock: '',
        cantidadMinima: '',
        cantidadMaxima: '',
        categoria: '',
        unidadMedida: '',
        fechaVencimiento: '',
        almacenId: ''
      });
      
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage({ type: 'error', text: error.response.data.message });
      } else {
        setMessage({ type: 'error', text: 'Error al agregar el producto' });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <h2>Agregar Nuevo Producto</h2>
      
      {/* Mensajes */}
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        {/* Información básica */}
        <div className="form-section">
          <h3>Información Básica</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="codigo">Código *</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                maxLength="50"
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                maxLength="100"
                required
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              maxLength="500"
              rows="3"
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <input
                type="text"
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                maxLength="50"
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="unidadMedida">Unidad de Medida</label>
              <select
                id="unidadMedida"
                name="unidadMedida"
                value={formData.unidadMedida}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Seleccionar...</option>
                <option value="Unidad">Unidad</option>
                <option value="Kg">Kilogramos</option>
                <option value="Lt">Litros</option>
                <option value="Mt">Metros</option>
                <option value="Caja">Caja</option>
                <option value="Paquete">Paquete</option>
              </select>
            </div>
          </div>
        </div>

        {/* Información de precio y stock */}
        <div className="form-section">
          <h3>Precio y Stock</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="precio">Precio *</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cantidadStock">Cantidad Inicial *</label>
              <input
                type="number"
                id="cantidadStock"
                name="cantidadStock"
                value={formData.cantidadStock}
                onChange={handleChange}
                min="0"
                required
                className="form-control"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cantidadMinima">Stock Mínimo</label>
              <input
                type="number"
                id="cantidadMinima"
                name="cantidadMinima"
                value={formData.cantidadMinima}
                onChange={handleChange}
                min="0"
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cantidadMaxima">Stock Máximo</label>
              <input
                type="number"
                id="cantidadMaxima"
                name="cantidadMaxima"
                value={formData.cantidadMaxima}
                onChange={handleChange}
                min="0"
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="form-section">
          <h3>Información Adicional</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="almacenId">Almacén *</label>
              <select
                id="almacenId"
                name="almacenId"
                value={formData.almacenId}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="">-- Seleccione un almacén --</option>
                {almacenes.map(almacen => (
                  <option key={almacen.id} value={almacen.id}>
                    {almacen.nombre} - {almacen.ciudad}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="fechaVencimiento">Fecha de Vencimiento</label>
              <input
                type="date"
                id="fechaVencimiento"
                name="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Guardando...' : 'Agregar Producto'}
          </button>
          
          <button 
            type="button" 
            onClick={() => setFormData({
              codigo: '',
              nombre: '',
              descripcion: '',
              precio: '',
              cantidadStock: '',
              cantidadMinima: '',
              cantidadMaxima: '',
              categoria: '',
              unidadMedida: '',
              fechaVencimiento: '',
              almacenId: ''
            })}
            className="btn btn-secondary"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;