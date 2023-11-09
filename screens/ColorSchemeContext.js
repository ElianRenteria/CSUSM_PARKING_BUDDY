import React, { createContext, useState } from 'react';

export const ColorSchemeContext = createContext({
  colorScheme: 'light',
  setColorScheme: () => { },
});

export const ColorSchemeProvider = ({ children }) => {
  const [colorScheme, setColorScheme] = useState('light');

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};