import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAppealedSuspensions, processAppealDecision } from "../../service/restaurantsService";
import Spinner from "../../spinner/Spinner";
import { showToast, showConfirm } from "../../utils/toast";

export default function SuspensionAppealsPage() {
  const navigate = useNavigate();
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState("active"); // "active" ili "rejected"

  useEffect(() => {
    loadAppeals();
  }, []);

  const loadAppeals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAppealedSuspensions();
      setAppeals(data);
    } catch (err) {
      console.error("Greška pri učitavanju žalbi:", err);
      setError("Greška pri učitavanju žalbi. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (restaurantId, accept) => {
    showConfirm(
      accept 
        ? "Da li ste sigurni da želite da prihvatite žalbu i uklonite suspenziju?"
        : "Da li ste sigurni da želite da odbijete žalbu?",
      async () => {
        try {
          setProcessingId(restaurantId);
          await processAppealDecision(restaurantId, accept);
          
          showToast.success(
            accept 
              ? "Žalba je prihvaćena i suspenzija je uklonjena."
              : "Žalba je odbijena."
          );
          
          await loadAppeals();
        } catch (err) {
          let errorMessage = "Greška pri obradi odluke.";
          
          if (err.response?.data) {
            if (err.response.data.message) {
              errorMessage = err.response.data.message;
            } else if (err.response.data.error) {
              errorMessage = err.response.data.error;
            }
          }
          
          showToast.error(errorMessage);
        } finally {
          setProcessingId(null);
        }
      }
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("sr-RS", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const activeAppeals = appeals.filter(a => a.status === "APPEALED");
  const rejectedAppeals = appeals.filter(a => a.status === "REJECTED");
  const displayedAppeals = activeTab === "active" ? activeAppeals : rejectedAppeals;

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="suspension-appeals-page">
      <div className="suspension-appeals-page__container">
        <div className="suspension-appeals-page__header">
          <button
            className="btn btn--secondary"
            onClick={() => navigate("/admin-restaurants/irresponsible")}
          >
            ← Nazad na neodgovorne restorane
          </button>
          <div>
            <h1>Žalbe na suspenzije</h1>
            <p>Pregled i obrada žalbi vlasnika restorana</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p className="error-message__text">{error}</p>
          </div>
        )}

        {/* Tabovi za filtriranje */}
        <div className="appeals-tabs" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "2px solid #e5e7eb" }}>
          <button
            className={`appeals-tab ${activeTab === "active" ? "appeals-tab--active" : ""}`}
            onClick={() => setActiveTab("active")}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              borderBottom: activeTab === "active" ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === "active" ? "#2563eb" : "#6b7280",
              fontWeight: activeTab === "active" ? "600" : "400",
              transition: "all 0.2s"
            }}
          >
            Aktivne žalbe ({activeAppeals.length})
          </button>
          <button
            className={`appeals-tab ${activeTab === "rejected" ? "appeals-tab--active" : ""}`}
            onClick={() => setActiveTab("rejected")}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              borderBottom: activeTab === "rejected" ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === "rejected" ? "#2563eb" : "#6b7280",
              fontWeight: activeTab === "rejected" ? "600" : "400",
              transition: "all 0.2s"
            }}
          >
            Odbijene žalbe ({rejectedAppeals.length})
          </button>
        </div>

        {displayedAppeals.length === 0 ? (
          <div className="empty-state">
            <h2>
              {activeTab === "active" 
                ? "Trenutno nema aktivnih žalbi" 
                : "Trenutno nema odbijenih žalbi"}
            </h2>
            <p>
              {activeTab === "active"
                ? "Sve žalbe su obrađene ili nema novih žalbi."
                : "Nema žalbi koje su odbijene."}
            </p>
          </div>
        ) : (
          <div className="appeals-list">
            {displayedAppeals.map((appeal) => (
              <div key={appeal.id} className="appeal-card">
                <div className="appeal-card__header">
                  <h3>{appeal.restaurantName || `Restoran ID: ${appeal.restaurantId}`}</h3>
                  <span 
                    className={`status-badge ${
                      appeal.status === "APPEALED" 
                        ? "status-badge--appealed" 
                        : "status-badge--rejected"
                    }`}
                    style={{
                      backgroundColor: appeal.status === "REJECTED" ? "#fee2e2" : "#dbeafe",
                      color: appeal.status === "REJECTED" ? "#991b1b" : "#1e40af",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      fontWeight: "500"
                    }}
                  >
                    {appeal.status === "APPEALED" ? "Žalba podneta" : "Žalba odbijena"}
                  </span>
                </div>

                <div className="appeal-card__content">
                  <div className="appeal-card__section">
                    <h4>Razlog suspenzije:</h4>
                    <p>{appeal.suspensionReason}</p>
                    <p className="appeal-card__date">
                      Suspendovan: {formatDate(appeal.suspendedAt)}
                    </p>
                  </div>

                  <div className="appeal-card__section">
                    <h4>Tekst žalbe:</h4>
                    <p>{appeal.appealText}</p>
                    <p className="appeal-card__date">
                      Žalba podneta: {appeal.appealDate ? formatDate(appeal.appealDate) : "N/A"}
                    </p>
                    {appeal.status === "REJECTED" && appeal.decisionDate && (
                      <p className="appeal-card__date" style={{ color: "#dc2626" }}>
                        Žalba odbijena: {formatDate(appeal.decisionDate)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="appeal-card__actions">
                  {appeal.status === "APPEALED" ? (
                    <>
                      <button
                        className="btn btn--success"
                        onClick={() => handleDecision(appeal.restaurantId, true)}
                        disabled={processingId === appeal.restaurantId}
                      >
                        {processingId === appeal.restaurantId ? "Obrađuje se..." : "Prihvati žalbu"}
                      </button>
                      <button
                        className="btn btn--danger"
                        onClick={() => handleDecision(appeal.restaurantId, false)}
                        disabled={processingId === appeal.restaurantId}
                      >
                        {processingId === appeal.restaurantId ? "Obrađuje se..." : "Odbij žalbu"}
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn--success"
                      onClick={() => handleDecision(appeal.restaurantId, true)}
                      disabled={processingId === appeal.restaurantId}
                    >
                      {processingId === appeal.restaurantId ? "Obrađuje se..." : "Prihvati žalbu"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
