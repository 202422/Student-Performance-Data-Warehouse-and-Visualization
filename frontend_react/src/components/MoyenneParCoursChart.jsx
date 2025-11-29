import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getMoyenneParCours } from "../services/statsService";

function MoyenneParCoursChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMoyenneParCours().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="w-full text-center py-10">
        <div className="loader" />
        <p>Chargement...</p>
      </div>
    );

  if (data.length === 0) return <p>Aucune donnée disponible</p>;

  return (
    <div style={{ width: "100%", height: 450, overflowX: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        📊 Moyenne par cours
      </h2>

      {/* Zone scrollable */}
      <div style={{ minWidth: 1100, height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="cours"
              angle={-25}
              textAnchor="end"
              interval={0}
              height={70}
            />

            <YAxis />

            <Tooltip />
            <Legend />

            <Bar
              dataKey="moyenne"
              fill="#4f46e5"
              radius={[6, 6, 0, 0]}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MoyenneParCoursChart;
