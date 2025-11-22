import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEmployeesByRestaurant,
  registerEmployee,
  updateEmployee,
  suspendEmployee,
  activateEmployee
} from "../service/employeeService";
import { useUser } from "../users/UserContext";
import EmployeeRow from "./EmployeeRow";
import EmployeeForm from "./EmployeeForm";
import Spinner from "../spinner/Spinner";
import "../../styles/_employees.scss";

const EmployeesDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useUser();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getEmployeesByRestaurant(id);
      setEmployees(data);
    } catch (err) {
      console.error("Greška pri učitavanju zaposlenih:", err);
      setError("Greška pri učitavanju zaposlenih.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [id]);

  const handleRegister = async (formData) => {
    try {
      await registerEmployee(id, formData);
      alert("Zaposleni je uspešno registrovan!");
      loadEmployees();
      setShowForm(false);
    } catch (err) {
      console.error("Greška:", err);
      alert("Greška pri registraciji zaposlenog.");
    }
  };

  const handleUpdate = async (formData) => {
    if (selectedEmployee) {
      try {
        await updateEmployee(selectedEmployee.id, formData);
        alert("Zaposleni je uspešno ažuriran!");
        setSelectedEmployee(null);
        setShowForm(false);
        loadEmployees();
      } catch (err) {
        console.error("Greška:", err);
        alert("Greška pri ažuriranju zaposlenog.");
      }
    }
  };

  const handleSuspend = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da suspenujete ovog zaposlenog?")) {
      return;
    }
    try {
      await suspendEmployee(id);
      alert("Zaposleni je suspendovan!");
      loadEmployees();
    } catch (err) {
      console.error("Greška:", err);
      alert("Greška pri suspendovanju.");
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateEmployee(id);
      alert("Zaposleni je aktiviran!");
      loadEmployees();
    } catch (err) {
      console.error("Greška:", err);
      alert("Greška pri aktiviranju.");
    }
  };

  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setSelectedEmployee(null);
    setShowForm(false);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="employees-dashboard">
      <div className="employees-dashboard__container">
        <div className="employees-dashboard__header">
          <button 
            className="btn btn--secondary"
            onClick={() => navigate("/restaurants/dashboard")}
          >
            ← Nazad na restorane
          </button>
          <div>
            <h1>Upravljanje zaposlenima</h1>
            <p>Registrujte i upravljajte zaposlenima u vašem restoranu</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p className="error-message__text">{error}</p>
          </div>
        )}

        {!showForm ? (
          <div className="employees-dashboard__actions">
            <button 
              className="btn btn--primary"
              onClick={() => setShowForm(true)}
            >
              + Dodaj novog zaposlenog
            </button>
          </div>
        ) : (
          <div className="employee-form-section">
            <div className="employee-form-section__header">
              <h2>{selectedEmployee ? "Izmeni zaposlenog" : "Registruj novog zaposlenog"}</h2>
            </div>
            <EmployeeForm
              onSubmit={selectedEmployee ? handleUpdate : handleRegister}
              selectedEmployee={selectedEmployee}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        <div className="employees-table-section">
          <div className="employees-table-section__header">
            <h2>Lista zaposlenih ({employees.length})</h2>
          </div>

          {employees.length === 0 ? (
            <div className="empty-state">
              <p>Trenutno nemate zaposlenih. Dodajte prvog zaposlenog klikom na dugme iznad.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Korisničko ime</th>
                    <th>Email</th>
                    <th>Uloga</th>
                    <th>Status</th>
                    <th>Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <EmployeeRow
                      key={emp.id}
                      employee={emp}
                      onEdit={() => handleEdit(emp)}
                      onSuspend={() => handleSuspend(emp.id)}
                      onActivate={() => handleActivate(emp.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeesDashboard;