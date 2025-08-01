import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../services/api';
import '../Estilos/InventoryList.css';

const InventoryList = () => {
  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [selectedAlmacenId, setSelectedAlmacenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener lista de almacenes
  useEffect(() => {
    const fetchAlmacenes = async () => {
      try {
        const response = await axios.get(API_ROUTES.LISTAR_ALMACENES);
        setAlmacenes(response.data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los almacenes.');
      }
    };

    fetchAlmacenes();
  }, []);

  // Consultar productos por almacén
  const consultarProductos = async () => {
    if (!selectedAlmacenId) {
      setError('Debe seleccionar un almacén.');
      return;
    }

    setLoading(true);
    setError('');
    setProductos([]);

    try {
      const response = await axios.get(API_ROUTES.INVENTARIO_PRODUCTOS(selectedAlmacenId));
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setProductos(data);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al consultar los productos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-container">
      <h2>Inventario por Almacén</h2>

      <div className="form-group">
        <label htmlFor="almacen">Seleccione un almacén:</label>
        <select
          id="almacen"
          value={selectedAlmacenId}
          onChange={(e) => {
            setSelectedAlmacenId(e.target.value);
            setError('');
            setProductos([]);
          }}
        >
          <option value="">-- Seleccionar --</option>
          {almacenes.map((almacen) => (
            <option key={almacen.id} value={almacen.id}>
              {almacen.nombre}
            </option>
          ))}
        </select>
        <button onClick={consultarProductos} disabled={!selectedAlmacenId || loading}>
          {loading ? 'Cargando...' : 'Consultar Productos'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {productos.length > 0 && (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Mín</th>
              <th>Máx</th>
              <th>Categoría</th>
              <th>Unidad</th>
              <th>Almacén</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={index}>
                <td>{producto.codigo}</td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.precio}</td>
                <td>{producto.cantidadStock}</td>
                <td>{producto.cantidadMinima}</td>
                <td>{producto.cantidadMaxima}</td>
                <td>{producto.categoria}</td>
                <td>{producto.unidadMedida}</td>
                <td>{producto.almacenId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && productos.length === 0 && selectedAlmacenId && !error && (
        <p className="info-message">No hay productos en este almacén.</p>
      )}
    </div>
  );
};

export default InventoryList;
