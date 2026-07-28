"use client";
import { createContext, useContext, useState } from "react";

const DateGateContext = createContext({
  dateResolved: false,
  setDateResolved: () => {},
});

export const DateGateProvider = ({ children }) => {
 
  const [dateResolved, setDateResolved] = useState(false);
const [dateConfirmedAt, setDateConfirmedAt] = useState(null);
  return (
   
      <DateGateContext.Provider value={{ dateResolved, setDateResolved, dateConfirmedAt, setDateConfirmedAt }}>
      {children}
    </DateGateContext.Provider>
  );
};

export const useDateGate = () => useContext(DateGateContext);