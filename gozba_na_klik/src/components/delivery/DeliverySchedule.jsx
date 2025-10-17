import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../users/UserContext";
import {
  getDeliverySchedule,
  createDeliverySchedule,
  updateDeliverySchedule,
  deleteDeliverySchedule
} from "../service/deliveryScheduleService";
import Spinner from "../spinner/Spinner";

const DAYS = [
  { id: 0, name: "Nedelja" },
  { id: 1, name: "Ponedeljak" },
  { id: 2, name: "Utorak" },
  { id: 3, name: "Sreda" },
  { id: 4, name: "Četvrtak" },
  { id: 5, name: "Petak" },
  { id: 6, name: "Subota" }
];

export default function DeliverySchedule() {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [weeklySchedule, setWeeklySchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [formData, setFormData] = useState({
    dayOfWeek: "",
    startTime: "09:00",
    endTime: "17:00"
  });
  const [isEditing, setIsEditing] = useState(false);
  
  const errorRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (userId) {
      loadSchedule();
    }
  }, [userId]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [error]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await getDeliverySchedule(userId);
      setWeeklySchedule(data);
      
    } catch (err) {
      setError(err.response?.data?.error || "Greška pri učitavanju rasporeda.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const handleAddDay = (dayId) => {
    setError("");
    setFormData({
      dayOfWeek: dayId,
      startTime: "09:00",
      endTime: "17:00"
    });
    setSelectedDay(dayId);
    setIsEditing(false);
    
    scrollToForm();
  };

  const handleEditDay = (schedule) => {
    setError("");
    setFormData({
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime
    });
    setSelectedDay(schedule.dayOfWeek);
    setIsEditing(true);
    
    scrollToForm();
  };

  const handleCancel = () => {
    setSelectedDay(null);
    setIsEditing(false);
    setError("");
    setFormData({
      dayOfWeek: "",
      startTime: "09:00",
      endTime: "17:00"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (isEditing) {
        const existingSchedule = weeklySchedule.schedule.find(
          s => s.dayOfWeek === formData.dayOfWeek
        );

        await updateDeliverySchedule(userId, existingSchedule.id, formData);
        alert("Raspored je uspešno ažuriran!");
      } else {
        await createDeliverySchedule(userId, formData);
        alert("Raspored je uspešno dodat!");
      }

      await loadSchedule();
      handleCancel();
      
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Greška pri čuvanju rasporeda.";
      setError(errorMsg);
    }
  };

  const handleDelete = async (schedule) => {
    if (!window.confirm(`Da li ste sigurni da želite da obrišete raspored za ${schedule.dayName}?`)) {
      return;
    }

    try {
      setError("");
      await deleteDeliverySchedule(userId, schedule.id);
      alert("Raspored je uspešno obrisan!");
      await loadSchedule();
      
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Greška pri brisanju rasporeda.";
      setError(errorMsg);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="delivery-schedule">
      <div className="delivery-schedule__container">
        <div className="delivery-schedule__header">
          <button
            className="btn btn--secondary"
            onClick={() => navigate("/delivery/dashboard")}
          >
            ← Nazad
          </button>
          <div>
            <h1>Moje radno vreme</h1>
            <p>Upravljajte svojim rasporedom dostave</p>
          </div>
        </div>

        {error && (
          <div className="error-message" ref={errorRef}>
            <p className="error-message__text">{error}</p>
          </div>
        )}

        <div className="schedule-stats">
          <div className="stat-card">
            <span className="stat-card__icon">📅</span>
            <div className="stat-card__content">
              <p className="stat-card__label">Radnih dana</p>
              <p className="stat-card__value">
                {weeklySchedule?.schedule?.length ?? 0}/7
              </p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-card__icon">⏰</span>
            <div className="stat-card__content">
              <p className="stat-card__label">Ukupno sati</p>
              <p className="stat-card__value">
                {weeklySchedule?.totalWeeklyHours ?? 0}h
              </p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-card__icon">✅</span>
            <div className="stat-card__content">
              <p className="stat-card__label">Preostalo</p>
              <p className="stat-card__value">
                {weeklySchedule?.remainingHours ?? 40}h
              </p>
            </div>
          </div>
        </div>

        {selectedDay !== null && (
          <div className="schedule-form-section" ref={formRef}>
            <div className="schedule-form-section__header">
              <h2>{isEditing ? "Izmeni raspored" : "Dodaj radno vreme"}</h2>
            </div>

            <form onSubmit={handleSubmit} className="schedule-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="day" className="form-label">Dan:</label>
                  <input
                    type="text"
                    id="day"
                    className="form-input"
                    value={DAYS.find(d => d.id === formData.dayOfWeek)?.name || ""}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="startTime" className="form-label">Početak:</label>
                  <input
                    type="time"
                    id="startTime"
                    className="form-input"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endTime" className="form-label">Kraj:</label>
                  <input
                    type="time"
                    id="endTime"
                    className="form-input"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn--secondary" onClick={handleCancel}>
                  Otkaži
                </button>
                <button type="submit" className="btn btn--primary">
                  {isEditing ? "Sačuvaj izmene" : "Dodaj raspored"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="days-list-section">
          <div className="days-list-section__header">
            <h2>Nedeljni raspored</h2>
          </div>

          <div className="days-grid">
            {DAYS.map(day => {
              const schedule = weeklySchedule?.schedule?.find(s => s.dayOfWeek === day.id);

              return (
                <div key={day.id} className={`day-card ${schedule ? 'day-card--active' : ''}`}>
                  <div className="day-card__header">
                    <h3>{day.name}</h3>
                    {schedule && (
                      <span className="day-card__badge">{schedule.hours}h</span>
                    )}
                  </div>

                  {schedule ? (
                    <div className="day-card__content">
                      <div className="time-display">
                        <span className="time-display__icon">🕐</span>
                        <span className="time-display__text">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>

                      <div className="day-card__actions">
                        <button
                          className="btn btn--small btn--secondary"
                          onClick={() => handleEditDay(schedule)}
                        >
                          Izmeni
                        </button>
                        <button
                          className="btn btn--small btn--danger"
                          onClick={() => handleDelete(schedule)}
                        >
                          Obriši
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="day-card__empty">
                      <p>Nije definisano</p>
                      <button
                        className="btn btn--small btn--primary"
                        onClick={() => handleAddDay(day.id)}
                        disabled={weeklySchedule?.remainingHours <= 0}
                      >
                        + Dodaj
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}