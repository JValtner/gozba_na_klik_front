import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRestaurantById, addClosedDate, removeClosedDate } from "../service/restaurantsService";
import Spinner from "../spinner/Spinner";
import { showToast, showConfirm } from "../utils/toast";

export default function ClosedDates() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [closedDates, setClosedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      const data = await getRestaurantById(Number(id));
      setRestaurant(data);
      setClosedDates(data.closedDates || []);
    } catch (err) {
      console.error("Greška pri učitavanju restorana:", err);
      setError("Greška pri učitavanju podataka.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDate = async () => {
    if (!newDate) {
      showToast.warning("Molimo unesite datum.");
      return;
    }

    if (closedDates.some(cd => cd.date.substring(0, 10) === newDate)) {
      showToast.warning("Ovaj datum je već dodat.");
      return;
    }

    try {
      const closedDate = {
        RestaurantId: Number(id),
        date: new Date(newDate).toISOString(),
        reason: newReason.trim() || null
      };

      await addClosedDate(Number(id), closedDate);
      showToast.success("Neradni datum je uspešno dodat!");
      loadRestaurantData();
      setNewDate("");
      setNewReason("");
    } catch (err) {
      console.error("Greška pri dodavanju neradnog datuma:", err);
      showToast.error("Greška pri dodavanju neradnog datuma. Pokušajte ponovo.");
    }
  };

  const handleRemoveDate = async (dateId) => {
    showConfirm(
      "Da li ste sigurni da želite da uklonite ovaj datum?",
      async () => {
        try {
          await removeClosedDate(Number(id), dateId);
          showToast.success("Neradni datum je uspešno uklonjen!");
          loadRestaurantData();
        } catch (err) {
          console.error("Greška pri uklanjanju neradnog datuma:", err);
          showToast.error("Greška pri uklanjanju neradnog datuma. Pokušajte ponovo.");
        }
      }
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("sr-RS", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Spinner />;
  }

  if (!restaurant) {
    return <div className="error">Restoran nije pronađen.</div>;
  }

  return (
    <div className="closed-dates">
      <div className="closed-dates__container">
        <div className="closed-dates__header">
          <button 
            className="btn btn--secondary"
            onClick={() => navigate(`/restaurants/edit/${id}`)}
          >
            ← Nazad
          </button>
          <div>
            <h1>Neradni datumi - {restaurant.name}</h1>
            <p>Upravljajte datumima kada je restoran zatvoren</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p className="error-message__text">{error}</p>
          </div>
        )}

        <div className="add-date-section">
          <h2>Dodaj neradni datum</h2>
          <div className="add-date-form">
            <div className="form-group">
              <label htmlFor="newDate">Datum:</label>
              <input
                type="date"
                id="newDate"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="reason">Razlog (opciono):</label>
              <input
                type="text"
                id="reason"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="npr. Praznik, Renoviranje"
                maxLength={100}
              />
            </div>
            <button 
              className="btn btn--primary"
              onClick={handleAddDate}
            >
              Dodaj datum
            </button>
          </div>
        </div>

        <div className="dates-list-section">
          <h2>Neradni datumi ({closedDates.length})</h2>
          
          {closedDates.length === 0 ? (
            <div className="empty-state">
              <p>Trenutno nema definisanih neradnih datuma.</p>
            </div>
          ) : (
            <div className="dates-list">
              {closedDates.map(closedDate => (
                <div key={closedDate.id} className="date-item">
                  <div className="date-item__info">
                    <div className="date-item__date">
                      {formatDate(closedDate.date)}
                    </div>
                    {closedDate.reason && (
                      <div className="date-item__reason">
                        {closedDate.reason}
                      </div>
                    )}
                  </div>
                  <button
                    className="btn btn--danger btn--small"
                    onClick={() => handleRemoveDate(closedDate.id)}
                  >
                    Ukloni
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}