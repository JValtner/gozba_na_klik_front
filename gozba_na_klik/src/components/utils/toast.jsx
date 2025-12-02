import React from 'react';
import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  },
  
  error: (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  },
  
  info: (message) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  },
  
  warning: (message) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  },
};

export const showConfirm = (message, onConfirm, onCancel = null) => {
  const modal = document.createElement('div');
  modal.className = 'confirm-modal-overlay';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

  const modalContent = document.createElement('div');
  modalContent.className = 'confirm-modal-content';
  modalContent.style.cssText = `
    background: white;
    border-radius: 8px;
    padding: 24px;
    min-width: 400px;
    max-width: 90vw;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e7eb;
  `;

  const messageEl = document.createElement('p');
  messageEl.textContent = message;
  messageEl.style.cssText = `
    margin: 0 0 20px 0;
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
    line-height: 1.5;
  `;

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  `;

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Otkaži';
  cancelBtn.style.cssText = `
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    background: #fff;
    color: #374151;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s ease;
  `;

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Potvrdi';
  confirmBtn.style.cssText = `
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    background: #ef4444;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s ease;
  `;

  cancelBtn.addEventListener('mouseenter', () => {
    cancelBtn.style.background = '#f9fafb';
  });
  cancelBtn.addEventListener('mouseleave', () => {
    cancelBtn.style.background = '#fff';
  });

  confirmBtn.addEventListener('mouseenter', () => {
    confirmBtn.style.background = '#dc2626';
  });
  confirmBtn.addEventListener('mouseleave', () => {
    confirmBtn.style.background = '#ef4444';
  });

  const handleConfirm = () => {
    modal.remove();
    onConfirm();
  };

  const handleCancel = () => {
    modal.remove();
    if (onCancel) onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const cleanup = () => {
    document.removeEventListener('keydown', handleKeyDown);
  };

  confirmBtn.addEventListener('click', () => {
    cleanup();
    handleConfirm();
  });
  
  cancelBtn.addEventListener('click', () => {
    cleanup();
    handleCancel();
  });
  
  document.addEventListener('keydown', handleKeyDown);

  modalContent.appendChild(messageEl);
  buttonContainer.appendChild(cancelBtn);
  buttonContainer.appendChild(confirmBtn);
  modalContent.appendChild(buttonContainer);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cleanup();
      handleCancel();
    }
  });
};

export default showToast;

