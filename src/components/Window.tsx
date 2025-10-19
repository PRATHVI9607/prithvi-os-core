import { useEffect, useRef, useState } from "react";
import { X, Minus, Square, Maximize2 } from "lucide-react";
import { WindowState, useWindows } from "@/contexts/WindowContext";
import { Button } from "@/components/ui/button";

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

export const Window = ({ window, children }: WindowProps) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindows();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-controls")) return;
    focusWindow(window.id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || window.isMaximized) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = Math.max(0, e.clientY - dragOffset.y);
      
      if (windowRef.current) {
        windowRef.current.style.left = `${newX}px`;
        windowRef.current.style.top = `${newY}px`;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, window.isMaximized]);

  if (window.isMinimized) return null;

  const style = window.isMaximized
    ? {
        left: 0,
        top: 0,
        width: "100vw",
        height: "calc(100vh - 64px)",
        zIndex: window.zIndex,
      }
    : {
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className="fixed glass-strong rounded-lg shadow-2xl flex flex-col overflow-hidden animate-scale-in"
      style={style}
      onMouseDown={() => focusWindow(window.id)}
    >
      {/* Title bar */}
      <div
        className="h-10 bg-primary/10 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <span className="font-semibold text-sm">{window.title}</span>
        <div className="window-controls flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-muted"
            onClick={() => minimizeWindow(window.id)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-muted"
            onClick={() => maximizeWindow(window.id)}
          >
            {window.isMaximized ? (
              <Square className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => closeWindow(window.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Window content */}
      <div className="flex-1 overflow-auto bg-card/50 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};
