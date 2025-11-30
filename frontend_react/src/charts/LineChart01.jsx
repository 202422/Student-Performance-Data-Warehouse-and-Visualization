import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';

import { chartColors } from './ChartjsConfig';
import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, CategoryScale, Tooltip,
} from 'chart.js';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, CategoryScale, Tooltip);

import { formatValue } from '../utils/Utils';

function LineChart01({ data, width, height }) {

  const canvasRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (!data || !data.labels || data.labels.length === 0) return;

    const ctx = canvasRef.current;
    if (!ctx) return;

    if (chart) chart.destroy();

    const newChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: false,            // 🔥 FIX 1
        maintainAspectRatio: false,   // 🔥 FIX 2
        scales: {
          x: {
  type: 'category',
  display: true,
  ticks: {
    color: '#666',        // Couleur en mode clair
    maxRotation: 45,      // Pour éviter la superposition
    minRotation: 45,
    font: {
      size: 10,
    }
  }
},
          y: {
            display: false,
            beginAtZero: true,
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: () => false,
              label: (ctx) => formatValue(ctx.parsed.y),
            }
          }
        },
      }
    });

    setChart(newChart);

    return () => {
      newChart.destroy();
    };

  }, [data]);

  return (
    <canvas ref={canvasRef} width={width} height={height}></canvas>
  );
}

export default LineChart01;
