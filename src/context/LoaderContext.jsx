import { createContext, useContext, useMemo, useState } from "react";

const LoaderContext = createContext({
  loading: false,
  setLoading: () => {},
  start: () => {},
  stop: () => {},
});

export function LoaderProvider({ children, initial = false }) {
  const [loading, setLoading] = useState(Boolean(initial));

  const value = useMemo(() => ({
    loading,
    setLoading,
    start: () => setLoading(true),
    stop: () => setLoading(false),
  }), [loading]);

  return (
    <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be used within LoaderProvider");
  return ctx;
}

export default LoaderContext;
