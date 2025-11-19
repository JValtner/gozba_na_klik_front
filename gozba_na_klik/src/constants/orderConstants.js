export const ORDER_STATUS_LABELS = {
  "NA_CEKANJU": "Na čekanju",
  "PRIHVAĆENA": "Prihvaćena", 
  "PREUZIMANJE U TOKU": "Preuzimanje u toku",
  "DOSTAVA U TOKU": "U dostavi",
  "ZAVRŠENO": "Završeno",
  "OTKAZANA": "Otkazana",
  "U_PRIPREMI": "U pripremi",
  "SPREMNA": "Spremna",
  "U_DOSTAVI": "U dostavi",
  "ISPORUČENA": "Isporučena"
};

export const ORDER_STATUS_COLORS = {
  "NA_CEKANJU": "#f59e0b",
  "PRIHVAĆENA": "#10b981",
  "PREUZIMANJE U TOKU": "#8b5cf6",
  "DOSTAVA U TOKU": "#6366f1",
  "ZAVRŠENO": "#10b981",
  "OTKAZANA": "#ef4444",
  "U_PRIPREMI": "#3b82f6",
  "SPREMNA": "#06b6d4",
  "U_DOSTAVI": "#6366f1",
  "ISPORUČENA": "#10b981"
};

export const getStatusLabel = (status) => {
  return ORDER_STATUS_LABELS[status] || status;
};

export const getStatusColor = (status) => {
  return ORDER_STATUS_COLORS[status] || "#6b7280";
};

