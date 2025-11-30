import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password
      });

      const role = res.data.role;
      console.log("Rôle :", role);

      // Redirection selon le rôle
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "prof") {
        navigate("/prof-dashboard");
      } else {
        setError("Rôle inconnu");
      }

    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Erreur réseau");
      }
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-xl">
        
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Connexion
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">

          {error && (
            <p className="text-red-400 text-center">{error}</p>
          )}

          <div>
            <label className="block text-sm mb-1 text-slate-300">Username</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 rounded bg-slate-700 text-white focus:ring focus:ring-blue-500 outline-none"
              placeholder="Votre username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-300">Mot de passe</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 rounded bg-slate-700 text-white focus:ring focus:ring-blue-500 outline-none"
              placeholder="Votre mot de passe..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
          >
            Se connecter
          </button>

        </form>

        <p className="text-center text-slate-400 text-sm mt-4">
          Pas de compte ?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Créer un compte
          </Link>
        </p>

      </div>
    </div>
  );
}
