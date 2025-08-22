import React, { useState } from 'react';
import { Table, Button, Form, Row, Col, Badge, Modal } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ListaCitas({ citas, cancelarCita, editarCita }) {
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  // para el modal de confirmación
  const [showModal, setShowModal] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  const normalizarTexto = texto =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const citasFiltradasPorEstado = filtro === "Todos"
    ? citas
    : citas.filter(c => c.estado === filtro);

  const citasFiltradas = citasFiltradasPorEstado.filter(c =>
    normalizarTexto(c.nombrePaciente).includes(normalizarTexto(busqueda)) ||
    normalizarTexto(c.especialidad).includes(normalizarTexto(busqueda))
  );

  const pendientes = citas.filter(c => c.estado === "Pendiente").length;
  const confirmadas = citas.filter(c => c.estado === "Confirmada").length;
  const canceladas = citas.filter(c => c.estado === "Cancelada").length;

  //  exportar a PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Listado de Citas Médicas", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["Paciente", "Fecha", "Especialidad", "Estado"]],
      body: citasFiltradas.map(c => [
        c.nombrePaciente,
        new Date(c.fecha).toLocaleString(),
        c.especialidad,
        c.estado
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [52, 58, 64] },
    });
    doc.save("citas_medicas.pdf");
  };

  // logica del modal
  const handleShowModal = (cita) => {
    setCitaSeleccionada(cita);
    setShowModal(true);
  };

  const handleConfirmarCancelacion = () => {
    if (citaSeleccionada) cancelarCita(citaSeleccionada.id);
    setShowModal(false);
    setCitaSeleccionada(null);
  };

  return (
    <div>
      {/* Contadores y botón PDF */}
      <Row className="mb-3">
        <Col>
          <h6>
            Pendientes: <Badge bg="secondary">{pendientes}</Badge>{' '}
            Confirmadas: <Badge bg="success">{confirmadas}</Badge>{' '}
            Canceladas: <Badge bg="danger">{canceladas}</Badge>
          </h6>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={exportarPDF}>
            Exportar PDF
          </Button>
        </Col>
      </Row>

      {/* Filtros */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Label>Filtrar por estado</Form.Label>
          <Form.Select value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option>Todos</option>
            <option>Pendiente</option>
            <option>Confirmada</option>
            <option>Cancelada</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Label>Buscar por paciente o especialidad</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ejemplo: Juan o Pediatria"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </Col>
      </Row>

      {/* Tabla de citas */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Fecha</th>
            <th>Especialidad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citasFiltradas.length > 0 ? (
            citasFiltradas.map(cita => (
              <tr key={cita.id}>
                <td>{cita.nombrePaciente}</td>
                <td>{new Date(cita.fecha).toLocaleString()}</td>
                <td>{cita.especialidad}</td>
                <td>{cita.estado}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => editarCita(cita)}
                  >
                    Editar
                  </Button>{' '}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleShowModal(cita)} // 👈 ahora abre el modal
                  >
                    Cancelar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay citas para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar cancelación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {citaSeleccionada && (
            <p>
              ¿Seguro que deseas cancelar la cita de <strong>{citaSeleccionada.nombrePaciente}</strong> ({citaSeleccionada.especialidad})?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleConfirmarCancelacion}>
            Sí, cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
