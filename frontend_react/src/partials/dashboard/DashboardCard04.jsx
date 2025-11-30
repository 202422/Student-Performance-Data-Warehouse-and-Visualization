import React, { useState, useEffect } from 'react';
import BarChart from '../../charts/BarChart01';
import { getMoyenneParCours } from '../../services/statsService';
import { getCssVariable } from '../../utils/Utils';

function DashboardCard04() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMoyenneParCours()
      .then(res => {
        if (res.data.length === 0) {
          setChartData({ labels: [], datasets: [] });
          return;
        }

        // On ne garde que les 5 premiers cours (API déjà triée)
        const top5 = res.data.slice(0, 5);
        const labels = top5.map(item => item.Cours);
        const values = top5.map(item => item["Moyenne finale"]);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Moyenne',
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
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Top 5 cours</h2>
      </header>
      <div className="grow p-4 flex items-center justify-center">
        {loading ? (
          <span className="text-gray-500">Chargement...</span>
        ) : chartData.datasets.length > 0 ? (
          <BarChart data={chartData} width={595} height={248} yLabel="Moyennes notes" />
        ) : (
          <span className="text-gray-500">Pas de données disponibles</span>
        )}
      </div>
    </div>
  );
}

export default DashboardCard04;
