import { useWindows } from "@/contexts/WindowContext";
import { Button } from "@/components/ui/button";
import { FileText, Calculator, Terminal, FolderOpen, Settings, CheckSquare, Clock, User, Gamepad2 } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";

const appIcons: Record<string, React.ReactNode> = {
  notepad: <FileText className="h-5 w-5" />,
  calculator: <Calculator className="h-5 w-5" />,
  terminal: <Terminal className="h-5 w-5" />,
  files: <FolderOpen className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
  todo: <CheckSquare className="h-5 w-5" />,
  clock: <Clock className="h-5 w-5" />,
  profile: <User className="h-5 w-5" />,
  games: <Gamepad2 className="h-5 w-5" />,
};

export const Taskbar = () => {
  const { windows, focusWindow, minimizeWindow } = useWindows();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTaskbarClick = (windowId: string, isMinimized: boolean) => {
    if (isMinimized) {
      focusWindow(windowId);
    } else {
      minimizeWindow(windowId);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 glass-strong border-t border-border z-50 flex items-center px-4 gap-2">
      {/* App launcher - could add menu here */}
      <div className="flex items-center gap-2 pr-4 border-r border-border">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-lg">
          P
        </div>
      </div>

      {/* Running apps */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto">
        {windows.map((window) => (
          <Button
            key={window.id}
            variant={window.isMinimized ? "ghost" : "secondary"}
            size="sm"
            className="gap-2 min-w-[120px] justify-start"
            onClick={() => handleTaskbarClick(window.id, window.isMinimized)}
          >
            {appIcons[window.appId]}
            <span className="truncate text-xs">{window.title}</span>
          </Button>
        ))}
      </div>

      {/* System tray */}
      <div className="flex items-center gap-4 pl-4 border-l border-border">
        <div className="text-sm font-medium">
          {format(currentTime, "HH:mm:ss")}
        </div>
        <div className="text-xs text-muted-foreground">
          {format(currentTime, "MMM dd, yyyy")}
        </div>
      </div>
    </div>
  );
};
