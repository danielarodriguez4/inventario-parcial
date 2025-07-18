import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Estilos/InventoryList.css';

const InventoryList = () => {
  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [selectedAlmacenId, setSelectedAlmacenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  const consultarProductos = async () => {
    if (!selectedAlmacenId) {
      setError('Debe seleccionar un almacén');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:8080/api/inventario/productos?almacenId=${selectedAlmacenId}`);
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setProductos(data);
    } catch (err) {
      setError('Error al consultar los productos');
      console.error(err);
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
          onChange={(e) => setSelectedAlmacenId(e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          {almacenes.map((almacen) => (
            <option key={almacen.id} value={almacen.id}>
              {almacen.nombre}
            </option>
          ))}
        </select>
        <button onClick={consultarProductos}>Consultar Productos</button>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Cargando productos...</div>}

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
    </div>
  );
};

export default InventoryList;
