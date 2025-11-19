import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/invoices";

export async function downloadInvoicePDF(orderId) {
  try {
    const response = await AxiosConfig.get(`${RESOURCE}/order/${orderId}/pdf`, {
      responseType: 'blob'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error downloading invoice PDF:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Račun za ovu porudžbinu nije pronađen');
    } else if (error.response?.status === 403) {
      throw new Error('Nemate dozvolu da vidite ovaj račun');
    } else if (error.response?.status === 400) {
      throw new Error('Račun se može generisati samo za završene porudžbine');
    } else {
      throw new Error('Greška pri generisanju računa. Pokušajte ponovo.');
    }
  }
}

export async function downloadInvoicePDFById(invoiceId) {
  try {
    const response = await AxiosConfig.get(`${RESOURCE}/${invoiceId}/pdf`, {
      responseType: 'blob'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error downloading invoice PDF by ID:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Račun sa navedenim ID nije pronađen');
    } else if (error.response?.status === 403) {
      throw new Error('Nemate dozvolu da vidite ovaj račun');
    } else {
      throw new Error('Greška pri generisanju računa. Pokušajte ponovo.');
    }
  }
}

export async function getInvoiceByOrderId(orderId) {
  try {
    const response = await AxiosConfig.get(`${RESOURCE}/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Račun za ovu porudžbinu nije pronađen');
    } else if (error.response?.status === 403) {
      throw new Error('Nemate dozvolu da vidite ovaj račun');
    } else {
      throw new Error('Greška pri dohvatanju računa. Pokušajte ponovo.');
    }
  }
}

export function openPDFInNewTab(pdfBlob, filename = 'invoice.pdf') {
  try {
    const pdfUrl = window.URL.createObjectURL(pdfBlob);
    
    const newTab = window.open(pdfUrl, '_blank');
    
    if (!newTab) {
      console.warn('Pop-up blokiran - korisnik mora ručno da dozvoli pop-up-ove');
      
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    setTimeout(() => {
      window.URL.revokeObjectURL(pdfUrl);
    }, 30000);
    
  } catch (error) {
    console.error('Error opening PDF:', error);
    throw new Error('Greška pri otvaranju PDF-a');
  }
}

export async function downloadAndOpenInvoicePDF(orderId, filename) {
  const pdfBlob = await downloadInvoicePDF(orderId);
  const pdfFilename = filename || `racun-porudzbina-${orderId}.pdf`;
  openPDFInNewTab(pdfBlob, pdfFilename);
}