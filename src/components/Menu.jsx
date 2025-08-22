import React from 'react';
import { Nav } from 'react-bootstrap';

export default function Menu({ cambiarVista }) {
  return (
    <Nav variant="tabs" className="mb-4">
      <Nav.Item>
        <Nav.Link onClick={() => cambiarVista('lista')}>Lista de Citas</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link onClick={() => cambiarVista('formulario')}>Agendar Nueva Cita</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}