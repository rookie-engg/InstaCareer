import React from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light custom-navbar">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center logo-animate" href="/">
            <img src="/images/logo.png" alt="Career Path Logo" width="50" height="50" />
            <span className="fw-bold brand-text ms-2">Career Path</span>
          </a>

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

          <div className="collapse navbar-collapse fade-in-right" id="navbarNav">
            <ul className="navbar-nav ms-auto nav-text">
              <li className="nav-item">
                <a className="nav-link" href="#heroSection">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#howworks">How it Works</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#aboutus">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link d-flex align-items-center">
                  <i className="bi bi-person me-1"></i> Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
