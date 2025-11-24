import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserAlergensById,
  UpdateUserAlergens,
} from "../service/userService";
import { getAllBasicAlergens } from "../service/alergenService";
import Spinner from "../spinner/Spinner";
import { useUser } from "./UserContext";

export default function EditUserAlergens() {
  const { userId } = useUser();
  const navigate = useNavigate();

  const [assignedAlergens, setAssignedAlergens] = useState([]);
  const [availableAlergens, setAvailableAlergens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const userAlergensResponse = await getUserAlergensById(userId);

      // Pokušaj da parsiraš podatke iz odgovora
      let userAlergens = [];

      if (userAlergensResponse?.Alergens) {
        userAlergens = userAlergensResponse.Alergens.map((a) => ({
          id: a.Id,
          name: a.Name,
        }));
      } else if (userAlergensResponse?.alergens) {
        userAlergens = userAlergensResponse.alergens.map((a) => ({
          id: a.id,
          name: a.name,
        }));
      }

      const allAlergens = await getAllBasicAlergens();

      setAssignedAlergens(userAlergens);
      setAvailableAlergens(
        allAlergens.filter((a) => !userAlergens.some((x) => x.id === a.id))
      );
    } catch (err) {
      console.error("Greška pri učitavanju alergena:", err);
      setError("Greška pri učitavanju alergena.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleAdd = (alergenId) => {
    const alergen = availableAlergens.find((a) => a.id === alergenId);
    if (!alergen) return;
    setAssignedAlergens((prev) => [...prev, alergen]);
    setAvailableAlergens((prev) => prev.filter((a) => a.id !== alergenId));
  };

  const handleRemove = (alergenId) => {
    const alergen = assignedAlergens.find((a) => a.id === alergenId);
    if (!alergen) return;
    setAvailableAlergens((prev) => [...prev, alergen]);
    setAssignedAlergens((prev) => prev.filter((a) => a.id !== alergenId));
  };

  const handleSave = async () => {
    try {
      const alergensIds = assignedAlergens.map((a) => a.id);

      const updatedUserResponse = await UpdateUserAlergens(userId, {
        alergens: alergensIds,
      });

      setStatusMsg("Alergeni uspešno ažurirani.");

      // Pokušaj da parsiraš podatke iz odgovora
      let userAlergens = [];

      if (updatedUserResponse?.Alergens) {
        userAlergens = updatedUserResponse.Alergens.map((a) => ({
          id: a.Id,
          name: a.Name,
        }));
      } else if (updatedUserResponse?.alergens) {
        userAlergens = updatedUserResponse.alergens.map((a) => ({
          id: a.id,
          name: a.name,
        }));
      } else {
        // Fallback - ponovo učitaj podatke
        await loadData();
        setTimeout(() => setStatusMsg(""), 3000);
        return;
      }

      const allAlergens = await getAllBasicAlergens();

      setAssignedAlergens(userAlergens);
      setAvailableAlergens(
        allAlergens.filter((a) => !userAlergens.some((x) => x.id === a.id))
      );

      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      console.error("Greška pri čuvanju alergena:", err);
      setError("Greška pri čuvanju izmena.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleBack = () => {
    navigate(-1); // vraća na prethodnu stranicu
  };

  if (loading) return <Spinner />;

  return (
    <>
      {statusMsg && <p className="status-span show">{statusMsg}</p>}
      {error && <p className="error-span show">{error}</p>}

      <div className="edit-user-alergens-wrapper">
        <div className="alergens-container">
          <div className="alergens-header">
            <h1>Upravljanje alergenima</h1>
            <p>Dodajte ili uklonite alergene koji vas pogađaju</p>
          </div>

          <div className="alergens-content">
            <div className="alergen-user-column">
              <h3>Moji alergeni</h3>
              {assignedAlergens.length === 0 ? (
                <p>Nema dodatih alergena.</p>
              ) : (
                <ul className="alergens-list">
                  {assignedAlergens.map((a) => (
                    <li key={a.id}>
                      <span className="alergen-name">{a.name}</span>
                      <button
                        className="btn btn--danger btn--small"
                        onClick={() => handleRemove(a.id)}
                        title="Ukloni alergen"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="alergen-user-column">
              <h3>Dostupni alergeni</h3>
              {availableAlergens.length === 0 ? (
                <p>Svi alergeni su već dodati.</p>
              ) : (
                <ul className="alergens-list">
                  {availableAlergens.map((a) => (
                    <li key={a.id}>
                      <span className="alergen-name">{a.name}</span>
                      <button
                        className="btn btn--primary btn--small"
                        onClick={() => handleAdd(a.id)}
                        title="Dodaj alergen"
                      >
                        +
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn--secondary" onClick={handleBack}>
              Nazad
            </button>
            <button className="btn btn--primary" onClick={handleSave}>
              💾 Sačuvaj izmene
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
