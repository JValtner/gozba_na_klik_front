import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRestaurantById, updateWorkSchedules } from "../service/restaurantsService";
import Spinner from "../spinner/Spinner";

const DAYS = [
  { id: 1, name: "Ponedeljak" },
  { id: 2, name: "Utorak" },
  { id: 3, name: "Sreda" },
  { id: 4, name: "Četvrtak" },
  { id: 5, name: "Petak" },
  { id: 6, name: "Subota" },
  { id: 0, name: "Nedelja" }
];

export default function WorkingHours() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      const data = await getRestaurantById(Number(id));
      setRestaurant(data);
      
      const initialSchedules = DAYS.map(day => {
        const existing = data.workSchedules?.find(ws => ws.dayOfWeek === day.id);
        return {
          dayOfWeek: day.id,
          openTime: existing?.openTime || "09:00:00",
          closeTime: existing?.closeTime || "21:00:00"
        };
      });
      setSchedules(initialSchedules);
    } catch (err) {
      console.error("Greška pri učitavanju restorana:", err);
      setError("Greška pri učitavanju podataka.");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (dayOfWeek, field, value) => {
    setSchedules(prev => prev.map(schedule =>
      schedule.dayOfWeek === dayOfWeek
        ? { ...schedule, [field]: value}
        : schedule
    ));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const schedulesForBackend = schedules.map(s => ({
  dayOfWeek: s.dayOfWeek,
  openTime: s.openTime.includes(':') ? s.openTime : s.openTime + ":00",
  closeTime: s.closeTime.includes(':') ? s.closeTime : s.closeTime + ":00"
}));
      
      await updateWorkSchedules(Number(id), schedulesForBackend);
      alert("Radno vreme je uspešno sačuvano!");
      navigate(`/restaurants/edit/${id}`);
    } catch (err) {
      console.error("Greška pri čuvanju radnog vremena:", err);
      setError("Greška pri čuvanju radnog vremena. Pokušajte ponovo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!restaurant) {
    return <div className="error">Restoran nije pronađen.</div>;
  }

  return (
    <div className="working-hours">
      <div className="working-hours__container">
        <div className="working-hours__header">
          <button 
            className="btn btn--secondary"
            onClick={() => navigate(`/restaurants/edit/${id}`)}
          >
            ← Nazad
          </button>
          <div>
            <h1>Radno vreme - {restaurant.name}</h1>
            <p>Podesite radne sate za svaki dan u nedelji</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p className="error-message__text">{error}</p>
          </div>
        )}

        <div className="days-grid">
          {DAYS.map(day => {
            const schedule = schedules.find(s => s.dayOfWeek === day.id);
            return (
              <div key={day.id} className="day-card">
                <h3>{day.name}</h3>
                <div className="time-inputs">
                  <div className="time-input">
                    <label>Otvaranje:</label>
                    <input
                      type="time"
                      value={schedule?.openTime.substring(0, 5) || "09:00"}
                      onChange={(e) => handleTimeChange(day.id, "openTime", e.target.value)}
                    />
                  </div>
                  <div className="time-input">
                    <label>Zatvaranje:</label>
                    <input
                      type="time"
                      value={schedule?.closeTime.substring(0, 5) || "21:00"}
                      onChange={(e) => handleTimeChange(day.id, "closeTime", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="working-hours__actions">
          <button
            className="btn btn--secondary"
            onClick={() => navigate(`/restaurants/edit/${id}`)}
            disabled={saving}
          >
            Otkaži
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Čuvanje..." : "Sačuvaj radno vreme"}
          </button>
        </div>
      </div>
    </div>
  );
}