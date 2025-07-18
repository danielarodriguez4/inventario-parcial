// src/services/apiRoutes.js

const BASE_URL = process.env.api_URL;

// GET
export const API_ROUTES = {
  LISTAR_ALMACENES: `${BASE_URL}/almacenes`,
  INVENTARIO_PRODUCTOS: (almacenId) => `${BASE_URL}/inventario/productos?almacenId=${almacenId}`,
  CREAR_PRODUCTO: `${BASE_URL}/productos`,
};