import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { baseUrl } from "../../../config/routeConfig";
import { getAddonsByMealId } from "../../service/addonsService";

export default function MealOrderModal({ meal, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [availableAddons, setAvailableAddons] = useState([]);
  const [independentAddons, setIndependentAddons] = useState([]);
  const [chosenAddons, setChosenAddons] = useState([]);
  const [selectedChosenAddon, setSelectedChosenAddon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let isMounted = true;
  const loadAddons = async () => {
    try {
      setLoading(true);
      const addons = await getAddonsByMealId(meal.id);
      if (!isMounted) return;
      
      const safeAddons = Array.isArray(addons) ? addons : [];
      const independent = safeAddons.filter(a => {
        const t = String(a.type ?? a.Type ?? "").toUpperCase();
        return t === "INDEPENDENT";
      });
      const chosen = safeAddons.filter(a => {
        const t = String(a.type ?? a.Type ?? "").toUpperCase();
        return t === "CHOSEN";
      });
      
      setAvailableAddons(safeAddons);
      setIndependentAddons(independent);
      setChosenAddons(chosen);
    } catch (err) {
      console.error("Greška:", err);
      if (isMounted) {
        setAvailableAddons([]);
        setIndependentAddons([]);
        setChosenAddons([]);
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  };
  loadAddons();
  return () => { isMounted = false };
}, [meal.id]);

  const handleIndependentAddonToggle = (addon) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleChosenAddonSelect = (addon) => {
    setSelectedChosenAddon(addon);
  };

  const getTotalPrice = () => {
    let total = meal.price * quantity;
    
    selectedAddons.forEach(addon => {
      total += addon.price * quantity;
    });
    
    if (selectedChosenAddon) {
      total += selectedChosenAddon.price * quantity;
    }
    
    return total;
  };

  const handleAddToCart = () => {
    const addonsToAdd = [...selectedAddons];
    if (selectedChosenAddon) {
      addonsToAdd.push(selectedChosenAddon);
    }
    
    onAddToCart(meal, quantity, addonsToAdd);
    onClose();
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  return createPortal(
    <div
      className="modal-overlay"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="meal-order-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="meal-image">
            {meal.imagePath ? (
              <img src={`${baseUrl}${meal.imagePath}`} alt={meal.name} />
            ) : (
              <div className="meal-placeholder">🍽️</div>
            )}
          </div>
          <div className="meal-info">
            <h2>{meal.name}</h2>
            <p className="meal-description">{meal.description}</p>
            <p className="meal-base-price">{meal.price.toFixed(2)} RSD</p>
          </div>
        </div>

        <div className="modal-body">
          {loading ? (
            <p>Učitavanje dodataka...</p>
          ) : (
            <>
              {/* Independent addons */}
              {independentAddons.length > 0 && (
                <div className="addons-section">
                  <h3>Dodatni prilozi (možete izabrati više)</h3>
                  <div className="addons-list">
                    {independentAddons.map(addon => (
                      <div 
                        key={addon.id} 
                        className={`addon-item ${selectedAddons.find(a => a.id === addon.id) ? 'addon-item--selected' : ''}`}
                        onClick={() => handleIndependentAddonToggle(addon)}
                      >
                        <input
                          type="checkbox"
                          checked={!!selectedAddons.find(a => a.id === addon.id)}
                          onChange={() => handleIndependentAddonToggle(addon)}
                        />
                        <span className="addon-name">{addon.name}</span>
                        <span className="addon-price">+{addon.price.toFixed(2)} RSD</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chosen addons */}
              {chosenAddons.length > 0 && (
                <div className="addons-section">
                  <h3>Izaberite opciju (samo jedna)</h3>
                  <div className="addons-list">
                    {chosenAddons.map(addon => (
                      <div 
                        key={addon.id} 
                        className={`addon-item ${selectedChosenAddon?.id === addon.id ? 'addon-item--selected' : ''}`}
                        onClick={() => handleChosenAddonSelect(addon)}
                      >
                        <input
                          type="radio"
                          name="chosenAddon"
                          checked={selectedChosenAddon?.id === addon.id}
                          onChange={() => handleChosenAddonSelect(addon)}
                        />
                        <span className="addon-name">{addon.name}</span>
                        <span className="addon-price">+{addon.price.toFixed(2)} RSD</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              <div className="quantity-section">
                <h3>Količina</h3>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn" 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button 
                    className="quantity-btn" 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 99}
                  >
                    +
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <div className="total-price">
            <span>Ukupno:</span>
            <span className="price-value">{getTotalPrice().toFixed(2)} RSD</span>
          </div>
          <div className="modal-actions">
            <button className="btn btn--secondary" onClick={onClose}>
              Otkaži
            </button>
            <button className="btn btn--primary" onClick={handleAddToCart}>
              Dodaj u korpu
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}