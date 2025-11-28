import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getMoyenneParCours } from "../services/statsService";

function MoyenneParCoursChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMoyenneParCours().then((res) => {
      console.log("Données reçues:", res);  // ← Ajouté pour debug
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (data.length === 0) return <p>Aucune donnée disponible</p>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="id_cours_fk__cours" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="moyenne" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MoyenneParCoursChart;
