import React, { useState, useEffect } from 'react';
import BarChart from '../../charts/BarChart01';
import { getHistogrammeNotes } from '../../services/statsService';
import { getCssVariable } from '../../utils/Utils';

function DashboardCardHistogramme() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistogrammeNotes()
      .then(res => {
        // Suppose que l'API renvoie un tableau comme :
        // [{ intervalle: "0-5", count: 10 }, { intervalle: "5-10", count: 25 }, ...]
        const labels = res.data.map(item => item.intervalle);
        const values = res.data.map(item => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Nombre d\'étudiants',
              data: values,
              backgroundColor: getCssVariable('--color-sky-500'),
              hoverBackgroundColor: getCssVariable('--color-sky-600'),
              barPercentage: 0.7,
              categoryPercentage: 0.7,
              borderRadius: 4,
            },
          ],
        });
      })
      .catch(err => console.error("Erreur API :", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Histogramme des notes</h2>
      </header>
      <div className="grow p-4 flex items-center justify-center">
        {loading ? (
          <span className="text-gray-500">Chargement...</span>
        ) : chartData.datasets.length > 0 ? (
          <BarChart 
  data={chartData} 
  width={595} 
  height={248} 
  xLabel="Intervalle des notes" 
  yLabel="Nombre d'étudiants" 
/>
        ) : (
          <span className="text-gray-500">Pas de données disponibles</span>
        )}
      </div>
    </div>
  );
}

export default DashboardCardHistogramme;
