// src/services/statsService.js
import axios from "axios";

export const getMoyenneParCours = async () => {
  return axios.get("http://127.0.0.1:8000/api/stats/moyenne-par-cours/");
};

export const getTauxReussiteGlobal = async () => {
  return axios.get("http://127.0.0.1:8000/api/stats/taux-reussite/");
};

export const getHistogrammeNotes = async () => {
  return axios.get("http://127.0.0.1:8000/api/stats/histogramme-notes/");
};