import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-4">
      <Container>
        <p className="mb-1">© {new Date().getFullYear()} Career Path Finder. All rights reserved.</p>
        <p className="mb-0">
          <a href="/about" className="text-white text-decoration-underline me-3">About</a>
          <a href="/contact" className="text-white text-decoration-underline me-3">Contact</a>
          <a href="/login" className="text-white text-decoration-underline">Login</a>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
