import { createContext, useContext, useState, useEffect } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';

const HistoryContext = createContext({
  history: [] as Location[],
  goBack: () => {},
  goForward: () => {},
  canGoBack: false,
  canGoForward: false,
});

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [history, setHistory] = useState([] as Location[]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  useEffect(() => {
    if (history[currentIndex]?.pathname == location.pathname) {
      return;
    }
    // Add new location and update index
    if (history[currentIndex]?.key !== location.key) {
      const newHistory = history.slice(0, currentIndex + 1);
      setHistory([...newHistory, location]);
      setCurrentIndex(newHistory.length);
    }
  }, [location]);

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      navigate(-1);
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      navigate(1);
    }
  };

  return (
    <HistoryContext.Provider value={{ history, goBack, goForward, canGoBack, canGoForward }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistoryContext = () => useContext(HistoryContext);
