class CurrencyApiService {
  constructor(baseUrl = "http://localhost:5065/api/currency") {
    this.baseUrl = baseUrl;
    this.cache = {}; // optional in-memory cache
  }

  async convert(amount, from, to) {
    if (from === to) return amount;

    const cacheKey = `${from}_${to}`;
    if (this.cache[cacheKey]) {
      return amount * this.cache[cacheKey];
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/convert?from=${from}&to=${to}&amount=${amount}`
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Currency API returned non-JSON:", await response.text());
        return amount;
      }

      const data = await response.json();
      if (data.converted == null) return amount;

      // cache the rate (approximate, assuming 1:1 conversion from amount=1)
      this.cache[cacheKey] = data.converted / amount;
      return data.converted;
    } catch (err) {
      console.error("Currency conversion failed:", err);
      return amount;
    }
  }
}

export const currencyApiService = new CurrencyApiService();
