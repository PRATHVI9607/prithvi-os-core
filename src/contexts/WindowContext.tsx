import { createContext, useContext, useState, ReactNode } from "react";

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  isMaximized: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  data?: any;
}

interface WindowContextType {
  windows: WindowState[];
  openWindow: (appId: string, title: string, data?: any) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowData: (id: string, data: any) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

let windowCounter = 0;
let zIndexCounter = 100;

export const WindowProvider = ({ children }: { children: ReactNode }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);

  const openWindow = (appId: string, title: string, data?: any) => {
    // Check if window for this app already exists
    const existing = windows.find((w) => w.appId === appId && !w.isMinimized);
    if (existing) {
      focusWindow(existing.id);
      return;
    }

    const id = `window-${windowCounter++}`;
    const newWindow: WindowState = {
      id,
      appId,
      title,
      isMaximized: false,
      isMinimized: false,
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 800, height: 600 },
      zIndex: zIndexCounter++,
      data,
    };

    setWindows((prev) => [...prev, newWindow]);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  };

  const focusWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, zIndex: zIndexCounter++, isMinimized: false }
          : w
      )
    );
  };

  const updateWindowData = (id: string, data: any) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, data: { ...w.data, ...data } } : w))
    );
  };

  return (
    <WindowContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updateWindowData,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};

export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) throw new Error("useWindows must be used within WindowProvider");
  return context;
};
