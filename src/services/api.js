// src/services/apiRoutes.js

const BASE_URL = process.env.REACT_APP_API_URL;

export const API_ROUTES = {
  LISTAR_ALMACENES: `${BASE_URL}/almacenes`,
  INVENTARIO_PRODUCTOS: (almacenId) => `${BASE_URL}/api/inventario/productos?almacenId=${almacenId}`,
  CREAR_PRODUCTO: `${BASE_URL}/api/inventario/productos`,
};
