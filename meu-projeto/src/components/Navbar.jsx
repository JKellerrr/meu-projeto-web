import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const isDark = theme === 'dark';

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/"></Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/produtos' ? 'active' : ''}`} to="/produtos">Produtos</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/contatos' ? 'active' : ''}`} to="/contatos">Contatos</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/carrinho' ? 'active' : ''}`} to="/carrinho">Carrinho</Link>
            </li>
          </ul>
        </div>
        <div className="d-flex align-items-center ms-auto theme-controls">
          <button
            onClick={toggleTheme}
            id="theme-toggle"
            type="button"
            className={`btn btn-sm px-2 py-1 ${isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`}
            aria-label="Alternar tema"
            style={{ fontSize: '0.8rem' }}
            title={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <Link to="/carrinho" className="btn btn-link btn-sm text-muted p-1 ms-2" aria-label="Carrinho">
            🛒
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
