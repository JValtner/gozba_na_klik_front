import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../users/UserContext";
import { getOrderPreview, createOrder } from "../service/orderService";
import { getRestaurantById } from "../service/restaurantsService";
import { getUserAddresses, createAddress } from "../service/addressService";
import { getCart, removeFromCart, clearCart, updateCartItemQuantity} from "../orders/AddToCart";
import AllergenWarningModal from "./AllergenWarningModal";
import Spinner from "../spinner/Spinner";
import { baseUrl } from "../../config/routeConfig";

const formatTime12Hour = (timeString) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(':').map(Number);
  const hour12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

const timeToSeconds = (timeString) => {
  if (!timeString) return 0;
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
};

const isRestaurantCurrentlyOpen = (restaurant) => {
  if (!restaurant || !restaurant.workSchedules || restaurant.workSchedules.length === 0) {
    return false;
  }

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toTimeString().slice(0, 8);
  const todayDate = now.toISOString().split('T')[0];

  const isClosedToday = restaurant.closedDates?.some(cd => {
    if (!cd || !cd.date) return false;
    const closedDate = new Date(cd.date).toISOString().split('T')[0];
    return closedDate === todayDate;
  });

  if (isClosedToday) {
    return false;
  }

  const todaySchedule = restaurant.workSchedules.find(
    ws => ws.dayOfWeek === currentDay
  );

  if (!todaySchedule) {
    return false;
  }

  const currentSeconds = timeToSeconds(currentTime);
  const openSeconds = timeToSeconds(todaySchedule.openTime);
  const closeSeconds = timeToSeconds(todaySchedule.closeTime);
  
  return currentSeconds >= openSeconds && currentSeconds <= closeSeconds;
};

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
      setError("");
      
      const cartData = getCart(restaurantId);

      if (cartData.length === 0) {
        setError("Vaša korpa je prazna.");
        setLoading(false);
        return;
      }

      setCart(cartData);

      try {
        const restaurantData = await getRestaurantById(restaurantId);
        setRestaurant(restaurantData);
      } catch (restErr) {
        setError("Greška pri učitavanju restorana.");
        setLoading(false);
        return;
      }

      let defaultAddressId = null;
      let userAddresses = [];
      
      try {
        userAddresses = await getUserAddresses();
        setSavedAddresses(userAddresses || []);

        if (userAddresses && userAddresses.length > 0) {
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
          } else {
            defaultAddressId = userAddresses[0].id;
            setSelectedAddressId(defaultAddressId);
          }
        }
      } catch (addrErr) {
        setSavedAddresses([]);
      }

      if (defaultAddressId && cartData.length > 0) {
        const orderData = {
          AddressId: defaultAddressId,
          CustomerNote: "",
          Items: cartData.map((item) => ({
            MealId: item.mealId,
            Quantity: item.quantity,
            SelectedAddonIds: item.selectedAddons
              ? item.selectedAddons.map((a) => a.id)
              : [],
          })),
          AllergenWarningAccepted: false,
        };

        try {
          const previewData = await getOrderPreview(restaurantId, orderData);
          setPreview(previewData);
        } catch (previewErr) {
          setPreview(null);
        }
      } else {
        setPreview(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Greška pri učitavanju porudžbine.");
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
      setCart([]);
      setPreview(null);
      alert("Korpa je prazna. Vraćamo vas nazad.");
      navigate(`/restaurants/${restaurantId}/menu`);
      return;
    }

    loadData();
  };

  const submitOrderDirectly = async (allergenAccepted) => {
    if (!addressForm.street || !addressForm.city || !addressForm.postalCode) {
      alert("Molimo popunite sve podatke o adresi.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      let finalAddressId = selectedAddressId;

      if (!useExistingAddress || (useExistingAddress && saveAddress && !selectedAddressId)) {
        try {
          const newAddress = await createAddress({
            street: addressForm.street,
            city: addressForm.city,
            postalCode: addressForm.postalCode,
            label: addressForm.label || "Adresa za dostavu",
            isDefault: savedAddresses.length === 0,
          });
          finalAddressId = newAddress.id;
        } catch (err) {
          setError("Greška pri kreiranju adrese. Molimo pokušajte ponovo.");
          return;
        }
      }

      if (!finalAddressId) {
        setError("Molimo unesite ili izaberite adresu za dostavu.");
        return;
      }

      const orderData = {
        AddressId: finalAddressId,
        CustomerNote: customerNote.trim() || null,
        Items: cart.map((item) => ({
          MealId: item.mealId,
          Quantity: item.quantity,
          SelectedAddonIds: item.selectedAddons
            ? item.selectedAddons.map((a) => a.id)
            : [],
        })),
        AllergenWarningAccepted: allergenAccepted,
      };

      const createdOrder = await createOrder(restaurantId, orderData);

      clearCart(restaurantId);
      alert(`✅ Porudžbina je uspešno kreirana! Broj porudžbine: ${createdOrder.id}`);
      navigate(`/orders/${createdOrder.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Greška pri kreiranju porudžbine.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!useExistingAddress && (!addressForm.street || !addressForm.city || !addressForm.postalCode)) {
      alert("Molimo popunite sve podatke o adresi.");
      return;
    }

    if (useExistingAddress && !selectedAddressId) {
      alert("Molimo izaberite adresu za dostavu.");
      return;
    }

    if (preview?.hasAllergens && !allergenWarningAccepted) {
      setShowAllergenModal(true);
      return;
    }

    await submitOrderDirectly(allergenWarningAccepted);
  };

  const handleAllergenAccept = () => {
    setShowAllergenModal(false);
    setAllergenWarningAccepted(true);
    submitOrderDirectly(true);
  };

  const handleAllergenCancel = () => {
    setShowAllergenModal(false);
    navigate(`/restaurants/${restaurantId}/menu`);
  };

  const handleCancel = () => {
    navigate(`/restaurants/${restaurantId}/menu`);
  };

  const handleAddressToggle = async (checked) => {
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
      await updatePreview(addr.id);
    } else {
      setAddressForm({
        street: "",
        city: "",
        postalCode: "",
        label: "Adresa za dostavu",
      });
      setSelectedAddressId(null);
      setPreview(null);
    }
  };

  const updatePreview = async (addressId) => {
    if (!addressId || cart.length === 0) return;

    try {
      const orderData = {
        AddressId: addressId,
        CustomerNote: customerNote.trim() || "",
        Items: cart.map((item) => ({
          MealId: item.mealId,
          Quantity: item.quantity,
          SelectedAddonIds: item.selectedAddons
            ? item.selectedAddons.map((a) => a.id)
            : [],
        })),
        AllergenWarningAccepted: false,
      };

      const previewData = await getOrderPreview(restaurantId, orderData);
      setPreview(previewData);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Greška pri učitavanju cena.");
    }
  };

  const handleSavedAddressChange = async (addressId) => {
    const selectedAddr = savedAddresses.find((a) => a.id === addressId);
    if (selectedAddr) {
      setAddressForm({
        street: selectedAddr.street,
        city: selectedAddr.city,
        postalCode: selectedAddr.postalCode,
        label: selectedAddr.label,
      });
      setSelectedAddressId(addressId);
      await updatePreview(addressId);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error && cart.length === 0) {
    return (
      <div className="order-summary-page">
        <div className="error-message">
          <p className="error-message__text">{error}</p>
          <button
            className="btn btn--primary"
            onClick={() => navigate(`/restaurants/${restaurantId}/menu`)}
          >
            Nazad na meni
          </button>
        </div>
      </div>
    );
  }

  const isRestaurantClosed = restaurant && !isRestaurantCurrentlyOpen(restaurant);

  return (
    <div className="order-summary-page">
      <div className="order-summary-page__container">
        <div className="order-summary-page__header">
          <h1>Pregled porudžbine</h1>
          <p>Restoran: {restaurant?.name}</p>
        </div>

        {isRestaurantClosed && (
          <div className="restaurant-closed-warning">
            <p>⚠️ Restoran je trenutno zatvoren. Ne možete kreirati porudžbinu.</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p className="error-message__text">{error}</p>
          </div>
        )}

        <div className="order-items">
          <h2>Stavke u korpi</h2>
          <div className="order-items-list">
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

        {preview ? (
          <>
            <div className="order-pricing">
              <div className="pricing-row">
                <span>Cena:</span>
                <span>{preview.subtotalPrice?.toFixed(2) || "0.00"} RSD</span>
              </div>
              <div className="pricing-row">
                <span>Dostava:</span>
                <span>{preview.deliveryFee?.toFixed(2) || "0.00"} RSD</span>
              </div>
              <div className="pricing-row pricing-row--total">
                <span>
                  <strong>Ukupno:</strong>
                </span>
                <span>
                  <strong>{preview.totalPrice?.toFixed(2) || "0.00"} RSD</strong>
                </span>
              </div>
            </div>

            {preview.hasAllergens && !allergenWarningAccepted && (
              <div className="allergen-notice">
                <p>⚠️ Ova porudžbina sadrži alergene. Bićete obavešteni pre potvrde.</p>
              </div>
            )}
          </>
        ) : (
          <div className="order-pricing-info">
            <p>Molimo unesite adresu dostave da biste videli cenu porudžbine.</p>
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