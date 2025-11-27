import AxiosConfig from "../../config/axios.config";

const PDF_RESOURCE = "/api/PdfReport";

// List stored monthly snapshots
export async function listMonthlySnapshots(restaurantId, year, month) {
  const response = await AxiosConfig.get(`${PDF_RESOURCE}`, {
    params: { restaurantId, year, month }
  });
  return response.data; // array of snapshots metadata
}

// Download a stored snapshot PDF
export async function downloadSnapshotPdf(snapshotId) {
  const response = await AxiosConfig.get(`${PDF_RESOURCE}/${snapshotId}/pdf`, {
    responseType: 'blob'
  });
  return response.data;
}

// Open a Blob as PDF in browser or download
export function openBlobPdf(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

// Download on-demand monthly report PDF (here we follow the "send DTO" approach you already used)
export async function downloadOnDemandMonthlyReport(dto) {
  const response = await AxiosConfig.post(`${PDF_RESOURCE}/on-demand/pdf`, dto, {
    responseType: 'blob'
  });
  return response.data;
}
