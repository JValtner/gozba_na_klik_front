import React, { createContext, useContext, useState } from "react";
import { currencyApiService } from "../service/CurrencyApiService";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("EUR");

  const convert = async (amount, from = "EUR") => {
    return currencyApiService.convert(amount, from, currency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
