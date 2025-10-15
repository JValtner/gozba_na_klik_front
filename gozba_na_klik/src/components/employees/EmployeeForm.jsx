import React, { useState, useEffect } from "react";

const EmployeeForm = ({ onSubmit, selectedEmployee, onCancel }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "RestaurantEmployee"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedEmployee) {
      setForm({
        username: selectedEmployee.username,
        email: selectedEmployee.email,
        password: "",
        role: selectedEmployee.role
      });
    } else {
      setForm({ 
        username: "", 
        email: "", 
        password: "", 
        role: "RestaurantEmployee" 
      });
    }
    setErrors({});
  }, [selectedEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Korisničko ime je obavezno";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email je obavezan";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Unesite validan email";
    }

    if (!selectedEmployee && !form.password.trim()) {
      newErrors.password = "Lozinka je obavezna za nove zaposlene";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(form);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Korisničko ime *
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          className={`form-input ${errors.username ? 'form-input--error' : ''}`}
          placeholder="Unesite korisničko ime"
        />
        {errors.username && (
          <p className="form-error">{errors.username}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={`form-input ${errors.email ? 'form-input--error' : ''}`}
          placeholder="zaposleni@restoran.com"
        />
        {errors.email && (
          <p className="form-error">{errors.email}</p>
        )}
      </div>

      {!selectedEmployee && (
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Lozinka *
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className={`form-input ${errors.password ? 'form-input--error' : ''}`}
            placeholder="Unesite lozinku"
          />
          {errors.password && (
            <p className="form-error">{errors.password}</p>
          )}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="role" className="form-label">
          Uloga *
        </label>
        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          className="form-input"
        >
          <option value="RestaurantEmployee">Zaposleni u restoranu</option>
          <option value="DeliveryPerson">Dostavljač</option>
        </select>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={onCancel}
        >
          Otkaži
        </button>
        <button
          type="submit"
          className="btn btn--primary"
        >
          {selectedEmployee ? "Sačuvaj izmene" : "Registruj zaposlenog"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;