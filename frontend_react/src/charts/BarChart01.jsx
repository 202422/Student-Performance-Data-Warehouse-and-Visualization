import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import { chartColors } from './ChartjsConfig';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { formatValue } from '../utils/Utils';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

function BarChart01({ data, width, height, xLabel = '', yLabel = '' }) {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const legend = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  useEffect(() => {
    if (!canvas.current) return;

    const ctx = canvas.current;
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        layout: { padding: 20 },
        scales: {
  y: {
    border: { display: false },
    ticks: {
      maxTicksLimit: 5,
      callback: (value) => formatValue(value),
      color: darkMode ? textColor.dark : textColor.light,
    },
    grid: {
      color: darkMode ? gridColor.dark : gridColor.light,
    },
    title: {  // <-- ajout
      display: yLabel !== '',
      text: yLabel,
      color: darkMode ? textColor.dark : textColor.light,
      font: { size: 14, weight: '500' }
    }
  },
  x: {
    border: { display: false },
    grid: { display: false },
    ticks: {
      color: darkMode ? textColor.dark : textColor.light,
    },
    title: {  // <-- ajout
      display: xLabel !== '',
      text: xLabel,
      color: darkMode ? textColor.dark : textColor.light,
      font: { size: 14, weight: '500' }
    }
  }
},
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: () => false,
              label: (context) => formatValue(context.parsed.y)
            },
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          }
        },
        interaction: { intersect: false, mode: 'nearest' },
        animation: { duration: 500 },
        maintainAspectRatio: false,
      },
      plugins: [
        {
          id: 'htmlLegend',
          afterUpdate(chartInstance) {
            const ul = legend.current;
            if (!ul) return;

            while (ul.firstChild) ul.removeChild(ul.firstChild);

            const items = chartInstance.options.plugins.legend.labels.generateLabels(chartInstance);
            items.forEach(item => {
              const li = document.createElement('li');
              const button = document.createElement('button');
              button.style.display = 'inline-flex';
              button.style.alignItems = 'center';
              button.style.opacity = item.hidden ? '.3' : '';
              button.onclick = () => {
                chartInstance.setDatasetVisibility(item.datasetIndex, !chartInstance.isDatasetVisible(item.datasetIndex));
                chartInstance.update();
              };

              const box = document.createElement('span');
              box.style.display = 'block';
              box.style.width = '12px';
              box.style.height = '12px';
              box.style.borderRadius = '50%';
              box.style.marginRight = '8px';
              box.style.backgroundColor = item.fillStyle;

              const labelContainer = document.createElement('span');
              labelContainer.style.display = 'flex';
              labelContainer.style.alignItems = 'center';
              const value = document.createElement('span');
              value.textContent = chartInstance.data.datasets[item.datasetIndex].data.reduce((a, b) => a + b, 0);
              value.style.fontWeight = '700';
              value.style.marginRight = '8px';

              const label = document.createElement('span');
              label.textContent = item.text;

              li.appendChild(button);
              button.appendChild(box);
              button.appendChild(labelContainer);
              labelContainer.appendChild(value);
              labelContainer.appendChild(label);
              ul.appendChild(li);
            });
          }
        }
      ]
    });

    setChart(newChart);
    return () => newChart.destroy();
  }, [data, darkMode]);

  useEffect(() => {
    if (!chart) return;

    // Update colors on theme change
    chart.options.scales.x.ticks.color = darkMode ? textColor.dark : textColor.light;
    chart.options.scales.y.ticks.color = darkMode ? textColor.dark : textColor.light;
    chart.options.scales.y.grid.color = darkMode ? gridColor.dark : gridColor.light;
    chart.options.plugins.tooltip.bodyColor = darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light;
    chart.options.plugins.tooltip.backgroundColor = darkMode ? tooltipBgColor.dark : tooltipBgColor.light;
    chart.options.plugins.tooltip.borderColor = darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light;
    chart.update('none');
  }, [currentTheme]);

  return (
    <React.Fragment>
       
      <div className="grow flex justify-center items-center p-4">
  <canvas ref={canvas} width={width} height={height} className="max-w-full" />
</div>

    </React.Fragment>
  );
}

export default BarChart01;
