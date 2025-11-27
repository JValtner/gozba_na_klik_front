import React, { useState } from 'react';
import { downloadAndOpenInvoicePDF } from '../service/invoiceService';

const InvoiceButton = ({ 
  orderId, 
  orderStatus, 
  className = "", 
  variant = "primary",
  size = "normal",
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOrderCompleted = () => {
    const completedStatuses = [
      'ZAVRŠENO', 
      'ISPORUČENA', 
      'DELIVERED', 
      'COMPLETED',
      'Completed'
    ];
    return completedStatuses.includes(orderStatus);
  };

  const handleDownloadPDF = async () => {
    if (!isOrderCompleted()) {
      setError('Račun je dostupan samo za završene porudžbine');
      setTimeout(() => setError(""), 4000);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      await downloadAndOpenInvoicePDF(orderId);
      
      if (typeof window !== 'undefined' && window.toast?.success) {
        window.toast.success('Račun je uspešno otvoren!');
      }
      
    } catch (err) {
      console.error('Error downloading invoice:', err);
      setError(err.message || 'Greška pri generisanju računa');
      
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (!isOrderCompleted()) {
    return null;
  }

  const buttonClasses = [
    'btn',
    `btn--${variant}`,
    size !== 'normal' ? `btn--${size}` : '',
    loading ? 'btn--loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="invoice-button-wrapper">
      <button
        className={buttonClasses}
        onClick={handleDownloadPDF}
        disabled={loading}
        title={loading ? "Generisanje računa..." : "Prikaži račun u PDF formatu"}
      >
        {loading ? (
          <>
            <span className="loading-spinner loading-spinner--small"></span>
            Generisanje...
          </>
        ) : (
          <>
            {children || "Prikaži račun"}
          </>
        )}
      </button>

      {error && (
        <div className="invoice-button-error">
          <p className="error-message__text">{error}</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceButton;