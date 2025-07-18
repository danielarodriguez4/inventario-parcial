import React, { useState } from 'react';
import InventoryList from './components/InventoryList';
import ProductForm from './components/ProductForm';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="App">
      <header className="app-header">
        <h1>Sistema de Inventario</h1>
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            Consultar Inventario
          </button>
          <button
            className={`nav-tab ${activeTab === 'add-product' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-product')}
          >
            Agregar Producto
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'inventory' && <InventoryList />}
        {activeTab === 'add-product' && <ProductForm />}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Sistema de Inventario - Universidad de Antioquia</p>
      </footer>
    </div>
  );
}

export default App;