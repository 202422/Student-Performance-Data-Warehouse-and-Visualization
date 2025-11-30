import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import EditMenu from '../../components/DropdownEditMenu';
import { getMoyenneParCours } from '../../services/statsService';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';
import { chartAreaGradient } from '../../charts/ChartjsConfig';

function DashboardCard01() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMoyenneParCours()
      .then(res => {
        const labels = res.data.map(item => item.Cours); // nom du cours
        const values = res.data.map(item => item["Moyenne finale"]); // moyenne finale

        setChartData({
          labels,
          datasets: [
            {
              data: values,
              fill: true,
              backgroundColor: function(context) {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) {
                  // fallback couleur simple si chartArea non défini
                  return adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2);
                }
                return chartAreaGradient(ctx, chartArea, [
                  { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
                  { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) }
                ]);
              },
              borderColor: getCssVariable('--color-violet-500'),
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: getCssVariable('--color-violet-500'),
              pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
              pointBorderWidth: 0,
              pointHoverBorderWidth: 0,
              tension: 0.2,
            },
          ],
        });
      })
      .catch(err => console.error("Erreur API :", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Moyenne par cours</h2>
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                Option 1
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                Option 2
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3" to="#0">
                Remove
              </Link>
            </li>
          </EditMenu>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Performance</div>
      </div>
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px] flex items-center justify-center">
        {loading ? (
          <span className="text-gray-500">Chargement...</span>
        ) : (
          chartData.datasets.length > 0 ? (
            <LineChart data={chartData} width={389} height={128} />
          ) : (
            <span className="text-gray-500">Pas de données disponibles</span>
          )
        )}
      </div>
    </div>
  );
}

export default DashboardCard01;
