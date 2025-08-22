import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

export default function FormularioCita({ agregarCita, citaEditar, guardarCitaEditada }) {
  const [form, setForm] = useState({
    nombrePaciente: '',
    fecha: '',
    especialidad: '',
    estado: 'Pendiente'
  });

  const [showModal, setShowModal] = useState(false);

  // Si hay cita para editar, cargamos sus datos
  useEffect(() => {
    if (citaEditar) {
      setForm(citaEditar);
    }
  }, [citaEditar]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.nombrePaciente || !form.fecha || !form.especialidad) {
      return alert("Todos los campos son obligatorios");
    }

    // Si es edición, mostramos modal en lugar de guardar directo
    if (citaEditar) {
      setShowModal(true);
    } else {
      agregarCita(form);
      setForm({ nombrePaciente: '', fecha: '', especialidad: '', estado: 'Pendiente' });
    }
  };

  const confirmarEdicion = () => {
    guardarCitaEditada(form);
    setShowModal(false);
    setForm({ nombrePaciente: '', fecha: '', especialidad: '', estado: 'Pendiente' });
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre del Paciente</Form.Label>
          <Form.Control 
            type="text" 
            name="nombrePaciente" 
            value={form.nombrePaciente} 
            onChange={handleChange} 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha y Hora</Form.Label>
          <Form.Control 
            type="datetime-local" 
            name="fecha" 
            value={form.fecha} 
            onChange={handleChange} 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Especialidad</Form.Label>
          <Form.Select 
            name="especialidad" 
            value={form.especialidad} 
            onChange={handleChange}
          >
            <option value="">Seleccione una especialidad</option>
            <option>Cardiología</option>
            <option>Pediatría</option>
            <option>Dermatología</option>
            <option>Oftalmología</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Estado</Form.Label>
          <Form.Select 
            name="estado" 
            value={form.estado} 
            onChange={handleChange}
          >
            <option>Pendiente</option>
            <option>Confirmada</option>
            <option>Cancelada</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          {citaEditar ? "Guardar Cambios" : "Agendar Cita"}
        </Button>
      </Form>

      {/* Modal de confirmación para edición */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar edición</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Seguro que deseas guardar los cambios en la cita de <strong>{form.nombrePaciente}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No
          </Button>
          <Button variant="primary" onClick={confirmarEdicion}>
            Sí, guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
