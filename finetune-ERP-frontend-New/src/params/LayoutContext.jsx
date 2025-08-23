import { createContext, useState, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const LayoutContext = createContext({
  navbarHeight: 64,
  viewportHeight: window.innerHeight,
});

export const LayoutProvider = ({ children }) => {
  const [layout, setLayout] = useState({
    navbarHeight: 64,
    viewportHeight: window.innerHeight,
  });

  useEffect(() => {
    const updateLayout = () => {
      const navbar = document.getElementById('dashboard-navbar');
      const height = navbar?.offsetHeight || 64;
      setLayout({
        navbarHeight: height,
        viewportHeight: window.innerHeight,
      });
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  return (
    <LayoutContext.Provider value={layout}>{children}</LayoutContext.Provider>
  );
};
