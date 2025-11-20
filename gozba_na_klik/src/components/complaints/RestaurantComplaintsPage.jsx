import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRestaurantComplaints } from "../service/complaintService";
import Spinner from "../spinner/Spinner";

const RestaurantComplaintsPage = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getRestaurantComplaints();
      setComplaints(data);
    } catch (err) {
      console.error("Greška pri učitavanju žalbi:", err);
      setError(err.response?.data?.message || "Greška pri učitavanju žalbi.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("sr-RS", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="restaurant-complaints">
      <div className="restaurant-complaints__container">
        <div className="restaurant-complaints__header">
          <button
            className="btn btn--secondary"
            onClick={() => navigate("/restaurants/dashboard")}
          >
            ← Nazad na restorane
          </button>
          <div>
            <h1>Žalbe kupaca</h1>
            <p>Pregled svih žalbi za vaš restoran</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p className="error-message__text">{error}</p>
            <button className="btn btn--secondary" onClick={loadComplaints}>
              Pokušaj ponovo
            </button>
          </div>
        )}

        {complaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📝</div>
            <h2>Nemate nijednu žalbu</h2>
            <p>Kada kupac podnese žalbu za porudžbinu, pojaviće se ovde.</p>
          </div>
        ) : (
          <div className="complaints-list">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="complaint-card">
                <div className="complaint-card__header">
                  <div>
                    <h3>Žalba za porudžbinu #{complaint.orderId}</h3>
                    <p className="complaint-date">
                      Podneta: {formatDate(complaint.createdAt)}
                    </p>
                  </div>
                  <button
                    className="btn btn--secondary btn--small"
                    onClick={() => navigate(`/orders/${complaint.orderId}`)}
                  >
                    Vidi porudžbinu
                  </button>
                </div>

                <div className="complaint-card__content">
                  <div className="complaint-info">
                    <p>
                      <strong>Kupac ID:</strong> {complaint.userId}
                    </p>
                    <p>
                      <strong>Porudžbina ID:</strong> {complaint.orderId}
                    </p>
                  </div>

                  <div className="complaint-message">
                    <h4>Poruka:</h4>
                    <p>{complaint.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantComplaintsPage;

