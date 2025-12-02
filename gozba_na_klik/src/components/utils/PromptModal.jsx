import { showToast } from './toast';

export const showPrompt = (message, placeholder = '', onConfirm, onCancel = null) => {
  const modal = document.createElement('div');
  modal.className = 'prompt-modal-overlay';
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
  modalContent.className = 'prompt-modal-content';
  modalContent.style.cssText = `
    background: white;
    border-radius: 8px;
    padding: 24px;
    min-width: 400px;
    max-width: 90vw;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  `;

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;
  input.style.cssText = `
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    margin: 16px 0;
    box-sizing: border-box;
  `;

  const messageEl = document.createElement('p');
  messageEl.textContent = message;
  messageEl.style.cssText = `
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
  `;

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 16px;
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
  `;

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Potvrdi';
  confirmBtn.style.cssText = `
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    background: #ea580c;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  `;

  const handleConfirm = () => {
    const value = input.value.trim();
    if (!value) {
      showToast.error('Molimo unesite vrednost.');
      return;
    }
    modal.remove();
    onConfirm(value);
  };

  const handleCancel = () => {
    modal.remove();
    if (onCancel) onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  input.addEventListener('keydown', handleKeyDown);
  confirmBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', handleCancel);

  modalContent.appendChild(messageEl);
  modalContent.appendChild(input);
  buttonContainer.appendChild(cancelBtn);
  buttonContainer.appendChild(confirmBtn);
  modalContent.appendChild(buttonContainer);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  input.focus();

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      handleCancel();
    }
  });
};

export default showPrompt;

