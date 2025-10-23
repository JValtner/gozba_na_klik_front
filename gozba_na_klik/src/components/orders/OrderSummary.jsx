import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../users/UserContext";
import { getOrderPreview, createOrder } from "../service/orderService";
import { getRestaurantById } from "../service/restaurantsService";
import { getUserAddresses, createAddress } from "../service/addressService";
import {
  getCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
} from "../orders/AddToCart";
import AllergenWarningModal from "./AllergenWarningModal";
import Spinner from "../spinner/Spinner";
import { baseUrl } from "../../config/routeConfig";

export default function OrderSummary() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { userId } = useUser();

  const [cart, setCart] = useState([]);
  const [preview, setPreview] = useState(null);
  const [restaurant, setRestaurant] = useState(null);

  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    postalCode: "",
    label: "Adresa za dostavu",
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [customerNote, setCustomerNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllergenModal, setShowAllergenModal] = useState(false);
  const [allergenWarningAccepted, setAllergenWarningAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [restaurantId, userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const cartData = getCart(restaurantId);

      if (cartData.length === 0) {
        setError("Vaša korpa je prazna.");
        setLoading(false);
        return;
      }

      setCart(cartData);

      const restaurantData = await getRestaurantById(restaurantId);
      setRestaurant(restaurantData);

      let defaultAddressId = null;
      try {
        const userAddresses = await getUserAddresses(userId);
        setSavedAddresses(userAddresses);

        const defaultAddress = userAddresses.find((a) => a.isDefault);
        if (defaultAddress) {
          setAddressForm({
            street: defaultAddress.street,
            city: defaultAddress.city,
            postalCode: defaultAddress.postalCode,
            label: defaultAddress.label || "Adresa za dostavu",
          });
          setSelectedAddressId(defaultAddress.id);
          setUseExistingAddress(true);
          defaultAddressId = defaultAddress.id;
        } else if (userAddresses.length > 0) {
          defaultAddressId = userAddresses[0].id;
        }
      } catch (err) {
        console.error("Greška pri učitavanju adresa:", err);
        setSavedAddresses([]);
      }

      const orderData = {
        addressId: defaultAddressId,
        customerNote: "",
        items: cartData.map((item) => ({
          mealId: item.mealId,
          quantity: item.quantity,
          selectedAddonIds: item.selectedAddons
            ? item.selectedAddons.map((a) => a.id)
            : [],
        })),
        allergenWarningAccepted: false,
      };

      const previewData = await getOrderPreview(restaurantId, userId, orderData);
      setPreview(previewData);
      console.log("=== PREVIEW DATA ===", previewData);
    } catch (err) {
      console.error("Greška pri učitavanju:", err);
      setError(err.response?.data?.error || "Greška pri učitavanju porudžbine.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(index);
      return;
    }

    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);

    updateCartItemQuantity(restaurantId, index, newQuantity);
    loadData();
  };

  const handleRemoveItem = (index) => {
    if (!window.confirm("Da li želite da uklonite ovu stavku iz korpe?")) return;

    removeFromCart(restaurantId, index);

    const updatedCart = getCart(restaurantId);
    if (updatedCart.length === 0) {
      alert("Korpa je prazna. Vraćamo vas nazad.");
      //navigate(`treba uvezati na josipov deo za meni`);
      return;
    }

    loadData();
  };

  const handleSubmitOrder = async () => {
    if (!addressForm.street || !addressForm.city || !addressForm.postalCode) {
      alert("Molimo popunite sve podatke o adresi.");
      return;
    }

    if (preview?.hasAllergens && !allergenWarningAccepted) {
      setShowAllergenModal(true);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      let finalAddressId = selectedAddressId;

      if (!useExistingAddress || saveAddress) {
        try {
          const newAddress = await createAddress(userId, {
            street: addressForm.street,
            city: addressForm.city,
            postalCode: addressForm.postalCode,
            label: addressForm.label || "Adresa za dostavu",
            isDefault: savedAddresses.length === 0,
          });
          finalAddressId = newAddress.id;
        } catch (err) {
          console.error("Greška pri kreiranju adrese:", err);
        }
      }

      const orderData = {
        addressId: finalAddressId,
        customerNote: customerNote.trim() || null,
        items: cart.map((item) => ({
          mealId: item.mealId,
          quantity: item.quantity,
          selectedAddonIds: item.selectedAddons
            ? item.selectedAddons.map((a) => a.id)
            : [],
        })),
        allergenWarningAccepted: allergenWarningAccepted,
      };

      const createdOrder = await createOrder(restaurantId, userId, orderData);

      clearCart(restaurantId);
      alert(`✅ Porudžbina je uspešno kreirana! Broj porudžbine: ${createdOrder.id}`);
      navigate(`/orders/${createdOrder.id}`);
    } catch (err) {
      console.error("Greška pri kreiranju porudžbine:", err);
      setError(err.response?.data?.error || "Greška pri kreiranju porudžbine.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAllergenAccept = () => {
    setShowAllergenModal(false);
    setAllergenWarningAccepted(true);
    
    setTimeout(() => {
      handleSubmitOrder();
    }, 100);
  };

  const handleAllergenCancel = () => {
    setShowAllergenModal(false);
  };

  const handleCancel = () => {
    //navigate(`treba spojiti na josipov deo`);
  };

  const handleAddressToggle = (checked) => {
    setUseExistingAddress(checked);
    if (checked && savedAddresses.length > 0) {
      const addr = savedAddresses[0];
      setAddressForm({
        street: addr.street,
        city: addr.city,
        postalCode: addr.postalCode,
        label: addr.label,
      });
      setSelectedAddressId(addr.id);
    } else {
      setAddressForm({
        street: "",
        city: "",
        postalCode: "",
        label: "Adresa za dostavu",
      });
      setSelectedAddressId(null);
    }
  };

  const handleSavedAddressChange = (addrId) => {
    setSelectedAddressId(addrId);
    const addr = savedAddresses.find((a) => a.id === addrId);
    if (addr) {
      setAddressForm({
        street: addr.street,
        city: addr.city,
        postalCode: addr.postalCode,
        label: addr.label,
      });
    }
  };

  if (loading) return <Spinner />;

  if (error && !preview)
    return (
      <div className="order-error">
        <div className="error-message">
          <p className="error-message__text">{error}</p>
          <button className="btn btn--primary" onClick={handleCancel}>
            Nazad na meni
          </button>
        </div>
      </div>
    );

  if (!preview || !restaurant) return null;

  const isRestaurantClosed = !preview.isRestaurantOpen;

  return (
    <div className="order-summary">
      <div className="order-summary__container">
        <div className="order-summary__header">
          <h1>Pregled porudžbine</h1>
          <p>
            Restoran: <strong>{preview.restaurantName}</strong>
          </p>
        </div>

        {isRestaurantClosed && (
          <div className="warning-message">
            <p className="warning-message__text">
              ⚠️ Restoran je trenutno zatvoren. {preview.closedReason}
            </p>
            <p>Ne možete kreirati porudžbinu dok restoran nije otvoren.</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p className="error-message__text">{error}</p>
          </div>
        )}

        <div className="order-items">
          <h2>Stavke porudžbine</h2>
          <div className="order-items__list">
            {cart.map((item, index) => (
              <div key={index} className="order-item">
                <div className="order-item__image">
                  {item.mealImagePath ? (
                    <img
                      src={`${baseUrl}${item.mealImagePath}`}
                      alt={item.mealName}
                      onError={(e) => {
                        e.target.src = "/default-meal.png";
                      }}
                    />
                  ) : (
                    <div className="order-item__placeholder">🍽️</div>
                  )}
                </div>
                <div className="order-item__details">
                  <h3>{item.mealName}</h3>
                  <p>Cena: {item.unitPrice.toFixed(2)} RSD</p>

                  <div className="order-item__quantity-control">
                    <label>Količina:</label>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleUpdateQuantity(index, item.quantity - 1)
                        }
                        disabled={isRestaurantClosed || isSubmitting}
                      >
                        −
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleUpdateQuantity(index, item.quantity + 1)
                        }
                        disabled={isRestaurantClosed || isSubmitting}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <div className="order-item__addons">
                      <strong>Dodaci:</strong>
                      <ul>
                        {item.selectedAddons.map((addon, addonIndex) => (
                          <li key={addonIndex}>
                            {addon.name} (+{addon.price.toFixed(2)} RSD)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="order-item__total-and-remove">
                  <div className="order-item__total">
                    <strong>
                      {(item.unitPrice * item.quantity).toFixed(2)} RSD
                    </strong>
                  </div>
                  <button
                    className="btn btn--danger btn--small"
                    onClick={() => handleRemoveItem(index)}
                    disabled={isRestaurantClosed || isSubmitting}
                  >
                    Ukloni
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="delivery-address">
          <h2>Adresa dostave</h2>

          {savedAddresses.length > 0 && (
            <div className="address-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={useExistingAddress}
                  onChange={(e) => handleAddressToggle(e.target.checked)}
                  disabled={isRestaurantClosed}
                />
                Koristi sačuvanu adresu
              </label>
            </div>
          )}

          {useExistingAddress && savedAddresses.length > 0 ? (
            <select
              value={selectedAddressId || ""}
              onChange={(e) =>
                handleSavedAddressChange(Number(e.target.value))
              }
              className="form-input"
              disabled={isRestaurantClosed}
            >
              {savedAddresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.label} - {addr.street}, {addr.city}
                </option>
              ))}
            </select>
          ) : (
            <div className="address-form">
              <div className="form-group">
                <label className="form-label">Ulica i broj</label>
                <input
                  type="text"
                  className="form-input"
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                  placeholder="npr. Nikole Tesle 15"
                  disabled={isRestaurantClosed}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Grad</label>
                  <input
                    type="text"
                    className="form-input"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    placeholder="npr. Novi Sad"
                    disabled={isRestaurantClosed}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Poštanski broj</label>
                  <input
                    type="text"
                    className="form-input"
                    value={addressForm.postalCode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        postalCode: e.target.value,
                      })
                    }
                    placeholder="npr. 21000"
                    disabled={isRestaurantClosed}
                    required
                  />
                </div>
              </div>

              <div className="save-address">
                <label>
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    disabled={isRestaurantClosed}
                  />
                  Sačuvaj ovu adresu za buduće porudžbine
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="customer-note">
          <h2>Napomena za restoran (opciono)</h2>
          <textarea
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
            placeholder="Unesite napomenu..."
            className="form-textarea"
            rows={3}
            maxLength={500}
            disabled={isRestaurantClosed}
          />
        </div>

        <div className="order-pricing">
          <div className="pricing-row">
            <span>Međuzbir:</span>
            <span>{preview.subtotalPrice.toFixed(2)} RSD</span>
          </div>
          <div className="pricing-row">
            <span>Dostava:</span>
            <span>{preview.deliveryFee.toFixed(2)} RSD</span>
          </div>
          <div className="pricing-row pricing-row--total">
            <span>
              <strong>Ukupno:</strong>
            </span>
            <span>
              <strong>{preview.totalPrice.toFixed(2)} RSD</strong>
            </span>
          </div>
        </div>

        {preview.hasAllergens && !allergenWarningAccepted && (
          <div className="allergen-notice">
            <p>⚠️ Ova porudžbina sadrži alergene. Bićete obavešteni pre potvrde.</p>
          </div>
        )}

        <div className="order-actions">
          <button
            className="btn btn--secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Otkaži
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSubmitOrder}
            disabled={isSubmitting || isRestaurantClosed}
          >
            {isSubmitting ? "Kreiranje..." : "Potvrdi porudžbinu"}
          </button>
        </div>
      </div>
      
      {showAllergenModal && (
        <AllergenWarningModal
          allergens={preview.allergens}
          onAccept={handleAllergenAccept}
          onCancel={handleAllergenCancel}
        />
      )}
    </div>
  );
}