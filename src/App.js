import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Menu from './components/Menu';
import ListaCitas from './components/ListaCitas';
import FormularioCita from './components/FormularioCita';
import pacientesData from './data/citas.json';

function App() {
  const [vista, setVista] = useState('lista');
  const [citas, setCitas] = useState([]);
  const [citaEditar, setCitaEditar] = useState(null);

  // Cargar citas desde localStorage o json inicial
  useEffect(() => {
    const citasGuardadas = localStorage.getItem("citas");
    if (citasGuardadas) {
      setCitas(JSON.parse(citasGuardadas));
    } else {
      setCitas(pacientesData.pacientes);
    }
  }, []);

  // Guardar citas en localStorage cada vez que cambien
  useEffect(() => {
    if (citas.length > 0) {
      localStorage.setItem("citas", JSON.stringify(citas));
    }
  }, [citas]);

  // Agregar nueva cita
  const agregarCita = cita => {
    const nuevaCita = {
      ...cita,
      id: citas.length > 0 ? citas[citas.length - 1].id + 1 : 1,
      estado: "Pendiente"
    };
    setCitas([...citas, nuevaCita]);
    setVista("lista");
  };

  // Cancelar cita
  const cancelarCita = id => {
    setCitas(citas.map(c =>
      c.id === id ? { ...c, estado: "Cancelada" } : c
    ));
  };

  // Editar cita
  const editarCita = cita => {
    setCitaEditar(cita);
    setVista("formulario");
  };

  // Guardar cita editada
  const guardarCitaEditada = citaActualizada => {
    setCitas(citas.map(c =>
      c.id === citaActualizada.id ? citaActualizada : c
    ));
    setCitaEditar(null);
    setVista("lista");
  };

  return (
    <Container className="mt-4">
      <h1>Gestión de Citas Médicas</h1>
      <Menu cambiarVista={setVista} />

      {vista === 'lista' ? (
        <ListaCitas 
          citas={citas} 
          cancelarCita={cancelarCita} 
          editarCita={editarCita} 
        />
      ) : (
        <FormularioCita 
          agregarCita={agregarCita} 
          citaEditar={citaEditar} 
          guardarCitaEditada={guardarCitaEditada}
        />
      )}
    </Container>
  );
}

export default App;
