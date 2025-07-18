import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryList.css';

const InventoryList = () => {
  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [selectedAlmacenId, setSelectedAlmacenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar lista de almacenes al montar el componente
  useEffect(() => {
    const fetchAlmacenes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/almacenes');
        setAlmacenes(response.data);
      } catch (err) {
        setError('Error al cargar los almacenes');
        console.error(err);
      }
    };
    fetchAlmacenes();
  }, []);

  // Función para consultar productos por almacén
  const consultarProductos = async () => {
    if (!selectedAlmacenId) {
      setError('Debe seleccionar un almacén');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`http://localhost:8080/api/productos/almacen/${selectedAlmacenId}`);
      setProductos(response.data);
    } catch (err) {
      setError('Error al consultar los productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(precio);
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CO');
  };

  return (
    <div className="inventory-list">
      <h2>Consultar Inventario</h2>
      
      {/* Selector de almacén */}
      <div className="search-section">
        <div className="form-group">
          <label htmlFor="almacen">Seleccionar Almacén:</label>
          <select 
            id="almacen"
            value={selectedAlmacenId}
            onChange={(e) => setSelectedAlmacenId(e.target.value)}
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
        
        <button 
          onClick={consultarProductos}
          disabled={loading || !selectedAlmacenId}
          className="btn btn-primary"
        >
          {loading ? 'Consultando...' : 'Consultar Productos'}
        </button>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Tabla de productos */}
      {productos.length > 0 && (
        <div className="products-table">
          <h3>Productos en Stock</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>Stock Máximo</th>
                <th>Unidad</th>
                <th>Estado</th>
                <th>Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.id} className={producto.cantidadStock <= producto.cantidadMinima ? 'stock-critico' : ''}>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria || 'Sin categoría'}</td>
                  <td>{formatearPrecio(producto.precio)}</td>
                  <td className={producto.cantidadStock <= producto.cantidadMinima ? 'text-warning' : ''}>
                    {producto.cantidadStock}
                    {producto.cantidadStock <= producto.cantidadMinima && ' ⚠️'}
                  </td>
                  <td>{producto.cantidadMinima}</td>
                  <td>{producto.cantidadMaxima || 'N/A'}</td>
                  <td>{producto.unidadMedida || 'Unidad'}</td>
                  <td>
                    <span className={`status ${producto.activo ? 'active' : 'inactive'}`}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{formatearFecha(producto.fechaVencimiento)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Resumen */}
          <div className="summary">
            <p><strong>Total de productos:</strong> {productos.length}</p>
            <p><strong>Productos con stock crítico:</strong> {productos.filter(p => p.cantidadStock <= p.cantidadMinima).length}</p>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay productos */}
      {productos.length === 0 && selectedAlmacenId && !loading && !error && (
        <div className="alert alert-info">
          No se encontraron productos en el almacén seleccionado.
        </div>
      )}
    </div>
  );
};

export default InventoryList;