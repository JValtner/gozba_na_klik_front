import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRestaurantById, updateWorkSchedules } from "../service/restaurantsService";
import Spinner from "../spinner/Spinner";
import { showToast } from "../utils/toast";

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
        const existing = data.workSchedules?.find(ws => {
          const dayOfWeekValue = typeof ws.dayOfWeek === 'number' ? ws.dayOfWeek : ws.dayOfWeek;
          return dayOfWeekValue === day.id;
        });
        
        const formatTime = (timeValue) => {
          if (!timeValue) return "";
          const timeString = typeof timeValue === 'string' ? timeValue : String(timeValue);
          if (timeString.length >= 5) {
            return timeString.substring(0, 5);
          }
          return timeString;
        };

        return {
          dayOfWeek: day.id,
          openTime: formatTime(existing?.openTime) || "09:00",
          closeTime: formatTime(existing?.closeTime) || "21:00"
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
    setSchedules(prev => {
      const updated = prev.map(schedule =>
        schedule.dayOfWeek === dayOfWeek
          ? { ...schedule, [field]: value }
          : schedule
      );
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const schedulesForBackend = schedules.map(s => ({
        dayOfWeek: s.dayOfWeek,
        openTime: s.openTime.length === 5 ? `${s.openTime}:00` : s.openTime,
        closeTime: s.closeTime.length === 5 ? `${s.closeTime}:00` : s.closeTime
      }));
      
      await updateWorkSchedules(Number(id), schedulesForBackend);
      showToast.success("Radno vreme je uspešno sačuvano!");
      await loadRestaurantData();
    } catch (err) {
      console.error("Greška pri čuvanju radnog vremena:", err);
      setError(err.response?.data?.message || "Greška pri čuvanju radnog vremena. Pokušajte ponovo.");
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
            
            if (!schedule) {
              return null;
            }

            return (
              <div key={day.id} className="day-card">
                <h3>{day.name}</h3>
                <div className="time-inputs">
                  <div className="time-input">
                    <label htmlFor={`open-${day.id}`}>Otvaranje:</label>
                    <input
                      id={`open-${day.id}`}
                      type="time"
                      value={schedule.openTime}
                      onChange={(e) => handleTimeChange(day.id, "openTime", e.target.value)}
                    />
                  </div>
                  <div className="time-input">
                    <label htmlFor={`close-${day.id}`}>Zatvaranje:</label>
                    <input
                      id={`close-${day.id}`}
                      type="time"
                      value={schedule.closeTime}
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