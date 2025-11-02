import React from 'react';
import { Outlet } from 'react-router-dom';

function App() {
  // A 'dark' class-t a <html> tagre kell majd tenni a dark mode-hoz
  // Itt lehetne egy globális kontextus pl. a téma váltáshoz
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <Outlet />
    </div>
  );
}

export default App;