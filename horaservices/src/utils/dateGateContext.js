"use client";
import { createContext, useContext, useState } from "react";

const DateGateContext = createContext({
  dateResolved: false,
  setDateResolved: () => {},
});

export const DateGateProvider = ({ children }) => {
 
  const [dateResolved, setDateResolved] = useState(false);

  return (
    <DateGateContext.Provider value={{ dateResolved, setDateResolved }}>
      {children}
    </DateGateContext.Provider>
  );
};

export const useDateGate = () => useContext(DateGateContext);