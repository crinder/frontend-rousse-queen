import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Home = () => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');

        // Si ya existe un gráfico, lo destruimos
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Creamos un nuevo gráfico y lo guardamos en la referencia
        chartRef.current = new Chart(ctx, {
            type: 'doughnut',
            options:{
                responsive: true,
                plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Grafico de ordenes'
                    }
                  }
            },
            data: {
                labels: ['Ordenes procesadas', 'Ordenes sin pagar', 'Pendientes'],
                datasets: [{
                    data: [10, 20, 30],
                    backgroundColor: ['#bf9b5f', '#e2e0e0', '#dd0707']
                }]
            }
        });
    }, []);

    return (
        <div className='home__padre'>
            <section className='home__graphic'>
            <canvas ref={canvasRef}></canvas>
            </section>
            
        </div>
    )
}

export default Home;
