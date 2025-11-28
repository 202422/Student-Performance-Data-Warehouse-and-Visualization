import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/stats";

export const getMoyenneParCours = async () => {
  try {
    const response = await axios.get(`${API_BASE}/moyenne-par-cours/`);
    console.log("Réponse API:", response.data); // <-- ajoute ce log
    return response.data;
  } catch (error) {
    console.error("Erreur API:", error);
    return [];
  }
};
