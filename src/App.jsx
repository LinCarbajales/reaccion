import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const JuegoReaccion = () => {
  const [colorCuadro, setColorCuadro] = useState('red');
  const [tiempoReaccion, setTiempoReaccion] = useState(null);
  const [estadoJuego, setEstadoJuego] = useState('inactivo');
  const [tiempoCambio, setTiempoCambio] = useState(null);
  const timeoutRef = useRef(null);
  const hiScore = useRef(null);

  const iniciarJuego = () => {
    if (estadoJuego === 'inactivo' || estadoJuego === 'completado') {
      setColorCuadro('gray');
      setTiempoReaccion(null);
      setEstadoJuego('esperando');
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      const tiempoAleatorio = Math.floor(Math.random() * 4000) + 3000;
      timeoutRef.current = setTimeout(() => {
        setColorCuadro('yellow');
        setEstadoJuego('listo');
        setTiempoCambio(Date.now());
      }, tiempoAleatorio);
    } 
    else if (estadoJuego === 'listo') {
      // Registrar tiempo de reacción
      const tiempoActual = Date.now();
      const tiempoTranscurrido = tiempoActual - tiempoCambio;
      if (hiScore.current === null || tiempoTranscurrido < hiScore.current) {
        hiScore.current = tiempoTranscurrido;
      }

      
      setTiempoReaccion(tiempoTranscurrido);
      setEstadoJuego('completado');
      setColorCuadro('green');
      
      // Limpiar timeout
      clearTimeout(timeoutRef.current);
    }
  };

  // Esta limpieza incluida en useEffect solamente está para casos como el de que se abandone la página (desmontaje), no tiene efecto en el flujo normal del juego
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="contenedor">
      <div className="cuadro"
        style={{
          backgroundColor: colorCuadro  // Le cambio el estilo dinámicamente en vez de cambiarlo de clase como hice en mis anteriores ejercicios, en las que creaba una clase para cada color
        }}
      />
      
      <button onClick={iniciarJuego} className="boton">
        {estadoJuego === 'inactivo' && 'Iniciar Juego'}
        {estadoJuego === 'esperando' && 'Espera...'}
        {estadoJuego === 'listo' && '¡Haz Clic Ahora!'}
        {estadoJuego === 'completado' && `Volver a intentar`}
      </button>
      
      <div style={{ marginTop: '20px' }}>
        {estadoJuego === 'esperando' && <p>El cuadro cambiará a amarillo en 3-7 segundos...</p>}
        {estadoJuego === 'completado' && <p>Reacción: {tiempoReaccion} ms</p>}
        {hiScore.current != null && <p>Mejor puntuación: {hiScore.current} ms</p> }
      </div>
    </div>
  );
};

export default JuegoReaccion;