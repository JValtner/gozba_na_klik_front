import React from "react";

export default function AllergenWarningModal({ allergens, onAccept, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚠️ Upozorenje o alergenima</h2>
        </div>

        <div className="modal-body">
          <p>Ova porudžbina sadrži sledeće alergene:</p>
          <ul className="allergen-list">
            {allergens.map((allergen, index) => (
              <li key={index} className="allergen-item">
                <span className="allergen-icon">⚠️</span>
                <span>{allergen}</span>
              </li>
            ))}
          </ul>
          <p className="allergen-warning-text">
            Molimo vas da potvrdite da ste svesni prisustva ovih alergena u vašoj porudžbini.
            Ako ste alergični na bilo koju od ovih komponenti, preporučujemo da <strong>ne nastavite</strong> sa porudžbinom.
          </p>
        </div>

        <div className="modal-actions">
          <button
            className="btn btn--secondary"
            onClick={onCancel}
          >
            Otkaži porudžbinu
          </button>
          <button
            className="btn btn--primary"
            onClick={onAccept}
          >
            Prihvatam i nastavi
          </button>
        </div>
      </div>
    </div>
  );
}