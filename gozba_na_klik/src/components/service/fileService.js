export function validateFile(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!file) return "Fajl nije izabran.";
  if (!allowedTypes.includes(file.type)) return "Dozvoljeni su samo JPEG, PNG i WebP formati.";
  if (file.size > maxSize) return "Fajl je prevelik. Maksimalna veličina je 5MB.";
  if (isSuspiciousFilename(file.name)) {
  return "Naziv fajla sadrži nedozvoljene karaktere ili ekstenziju.";
}

  return true;
}

const isSuspiciousFilename = (filename) => {
  const suspiciousPatterns = [
    /\.\./, // directory traversal
    /[<>:"/\\|?*]/, // illegal characters
    /\.(exe|bat|sh|php|js)$/i, // dangerous extensions
  ];
  return suspiciousPatterns.some((pattern) => pattern.test(filename));
};
