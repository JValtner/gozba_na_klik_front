import React, { useState, useEffect } from "react";
import { getAddonsByMealId, addAddon, removeAddon, activateChosenAddon } from "../../service/addonsService";
import Spinner from "../../spinner/Spinner";
import AddonForm from "./addonForm";

export default function DisplayAddons({ mealId }) {
  const [independentAddons, setIndependentAddons] = useState([]);
  const [chosenAddons, setChosenAddons] = useState([]);
  const [selectedChosenId, setSelectedChosenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // ✅ Load addons when mealId changes
  useEffect(() => {
    const loadAddons = async () => {
      try {
        setLoading(true);
        const mealAddons = await getAddonsByMealId(mealId);

        // Separate addons by type
        const independents = mealAddons.filter(a => a.type === "independent");
        const chosen = mealAddons.filter(a => a.type === "chosen");

        setIndependentAddons(independents);
        setChosenAddons(chosen);

        // Get currently active chosen addon (if any)
        const active = chosen.find(a => a.isActive);
        setSelectedChosenId(active ? active.id : null);
      } catch (err) {
        console.error(err);
        setError("Failed to load addons for this meal.");
      } finally {
        setLoading(false);
      }
    };

    if (mealId) loadAddons();
  }, [mealId]);

  // ✅ Helper to show temporary status message
  const showStatus = (msg, color = "green") => {
    setStatusMsg({ text: msg, color });
    setTimeout(() => setStatusMsg(""), 3000);
  };

  // ✅ Add new addon
  const handleAdd = async (addonData) => {
    try {
      const payload = {
        name: addonData.name.trim(),
        price: parseFloat(addonData.price),
        type: addonData.type,
        mealId: Number(mealId),
        isActive: false // new chosen addons start inactive
      };

      const created = await addAddon(payload);

      if (created.type === "independent") {
        setIndependentAddons(prev => [...prev, created]);
      } else {
        setChosenAddons(prev => [...prev, created]);
      }

      showStatus("Addon successfully added.");
    } catch (err) {
      console.error(err);
      showStatus("Failed to add addon.", "red");
    }
  };

  // ✅ Activate chosen addon
  const handleChosenSelect = async (id) => {
    setSelectedChosenId(id);
    try {
      await activateChosenAddon(id);
      setChosenAddons(prev =>
        prev.map(a => ({ ...a, isActive: a.id === id }))
      );
      showStatus("Chosen addon activated.");
    } catch (err) {
      console.error(err);
      showStatus("Failed to activate chosen addon.", "red");
    }
  };

  // ✅ Remove addon
  const handleRemove = async (addonId, type) => {
    try {
      await removeAddon(addonId);

      if (type === "independent") {
        setIndependentAddons(prev => prev.filter(a => a.id !== addonId));
      } else {
        setChosenAddons(prev => prev.filter(a => a.id !== addonId));
        if (selectedChosenId === addonId) setSelectedChosenId(null);
      }

      showStatus("Addon successfully removed.");
    } catch (err) {
      console.error(err);
      showStatus("Failed to remove addon.", "red");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="addons-page">
      {/* ✅ Status message */}
      {statusMsg && (
        <p style={{ color: statusMsg.color, fontWeight: "500" }}>
          {statusMsg.text}
        </p>
      )}

      {/* Independent Addons */}
      <section className="addon-section">
        <h3>Independent Addons</h3>
        {independentAddons.length === 0 ? (
          <p>No independent addons added.</p>
        ) : (
          <ul className="addon-list">
            {independentAddons.map(a => (
              <li key={a.id}>
                {a.name} (${a.price.toFixed(2)})
                <button onClick={() => handleRemove(a.id, "independent")}>−</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Chosen Addons */}
      <section className="addon-section">
        <h3>Chosen Addon</h3>
        {chosenAddons.length === 0 ? (
          <p>No chosen addons added.</p>
        ) : (
          chosenAddons.map(a => (
            <div
              key={a.id}
              className={`chosen-addon ${a.id === selectedChosenId ? "selected" : ""}`}
            >
              <label>
                <input
                  type="radio"
                  name="chosenAddon"
                  value={a.id}
                  checked={a.id === selectedChosenId}
                  onChange={() => handleChosenSelect(a.id)}
                />
                {a.name} (${a.price.toFixed(2)})
              </label>
              <button type="button" onClick={() => handleRemove(a.id, "chosen")}>−</button>
            </div>
          ))
        )}
      </section>

      {/* Add New Addon Form */}
      <section className="addon-section">
        <h3>Add New Addon</h3>
        <AddonForm mealId={mealId} onSubmit={handleAdd} />
      </section>
    </div>
  );
}
