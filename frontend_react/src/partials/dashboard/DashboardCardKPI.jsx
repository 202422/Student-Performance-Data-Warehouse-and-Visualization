import React, { useState, useEffect } from 'react';
import { getTauxReussiteGlobal } from '../../services/statsService'; // API à créer côté backend

function DashboardCardKPI() {
  const [taux, setTaux] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTauxReussiteGlobal()
      .then(res => {
        setTaux(res.data.taux_reussite); // suppose que l'API renvoie { taux: 85 }
      })
      .catch(err => console.error("Erreur API :", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
     <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Taux de réussite global</h2>
      </header>
      <div className="flex items-center justify-center grow">
        {loading ? (
          <span className="text-gray-500">Chargement...</span>
        ) : (
          <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            {taux}%
          </span>
        )}
      </div>
    </div>
  );
}

export default DashboardCardKPI;
