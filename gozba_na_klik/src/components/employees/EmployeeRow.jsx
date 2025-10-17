import React from "react";

const EmployeeRow = ({ employee, onEdit, onSuspend, onActivate }) => {
  const roleLabels = {
    RestaurantEmployee: "Zaposleni u restoranu",
    DeliveryPerson: "Dostavljač"
  };

  return (
    <tr className={`employee-row ${!employee.isActive ? 'employee-row--inactive' : ''}`}>
      <td>
        <div className="employee-info">
          <span className="employee-name">{employee.username}</span>
        </div>
      </td>
      <td>
        <span className="employee-email">{employee.email}</span>
      </td>
      <td>
        <span className="employee-role">
          {roleLabels[employee.role] || employee.role}
        </span>
      </td>
      <td>
        <span className={`status-badge ${employee.isActive ? 'status-badge--active' : 'status-badge--inactive'}`}>
          {employee.isActive ? "Aktivan" : "Suspendovan"}
        </span>
      </td>
      <td>
        <div className="employee-actions">
          <button 
            className="btn btn--small btn--secondary"
            onClick={onEdit}
            title="Izmeni zaposlenog"
          >
            Izmeni
          </button>
          {employee.isActive ? (
            <button 
              className="btn btn--small btn--danger"
              onClick={onSuspend}
              title="Suspenduj zaposlenog"
            >
              Suspenduj
            </button>
          ) : (
            <button 
              className="btn btn--small btn--success"
              onClick={onActivate}
              title="Aktiviraj zaposlenog"
            >
              Aktiviraj
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default EmployeeRow;