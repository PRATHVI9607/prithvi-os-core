import { useTheme } from "@/contexts/ThemeContext";
import { useWindows } from "@/contexts/WindowContext";
import { 
  FileText, 
  Calculator, 
  Terminal as TerminalIcon, 
  FolderOpen, 
  Settings,
  CheckSquare,
  Clock,
  User,
  Gamepad2
} from "lucide-react";
import { Window } from "./Window";
import { Notepad } from "./apps/Notepad";
import { Calculator as CalcApp } from "./apps/Calculator";
import { Terminal } from "./apps/Terminal";
import { FileExplorer } from "./apps/FileExplorer";
import { SettingsApp } from "./apps/Settings";
import { TodoApp } from "./apps/TodoApp";
import { ClockApp } from "./apps/ClockApp";
import { ProfileApp } from "./apps/ProfileApp";
import { GamesApp } from "./apps/GamesApp";

interface DesktopIcon {
  id: string;
  name: string;
  icon: React.ReactNode;
  app: string;
}

const desktopIcons: DesktopIcon[] = [
  { id: "notepad", name: "Notepad", icon: <FileText className="h-8 w-8" />, app: "notepad" },
  { id: "calculator", name: "Calculator", icon: <Calculator className="h-8 w-8" />, app: "calculator" },
  { id: "terminal", name: "Terminal", icon: <TerminalIcon className="h-8 w-8" />, app: "terminal" },
  { id: "files", name: "Files", icon: <FolderOpen className="h-8 w-8" />, app: "files" },
  { id: "todo", name: "Todo", icon: <CheckSquare className="h-8 w-8" />, app: "todo" },
  { id: "clock", name: "Clock", icon: <Clock className="h-8 w-8" />, app: "clock" },
  { id: "profile", name: "Profile", icon: <User className="h-8 w-8" />, app: "profile" },
  { id: "games", name: "Games", icon: <Gamepad2 className="h-8 w-8" />, app: "games" },
  { id: "settings", name: "Settings", icon: <Settings className="h-8 w-8" />, app: "settings" },
];

export const Desktop = () => {
  const { theme } = useTheme();
  const { windows, openWindow } = useWindows();

  const handleIconDoubleClick = (appId: string, appName: string) => {
    openWindow(appId, appName);
  };

  const renderApp = (window: any) => {
    switch (window.appId) {
      case "notepad":
        return <Notepad windowId={window.id} />;
      case "calculator":
        return <CalcApp />;
      case "terminal":
        return <Terminal />;
      case "files":
        return <FileExplorer />;
      case "settings":
        return <SettingsApp />;
      case "todo":
        return <TodoApp />;
      case "clock":
        return <ClockApp />;
      case "profile":
        return <ProfileApp />;
      case "games":
        return <GamesApp />;
      default:
        return <div className="p-4">App not found</div>;
    }
  };

  return (
    <div className={`relative h-full ${theme === "sun" ? "theme-sun-bg" : "theme-moon-bg"}`}>
      {/* Animated background elements */}
      {theme === "sun" ? (
        <>
          {/* Sun */}
          <div className="absolute top-10 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-2xl shadow-yellow-500/50 animate-float" />
          
          {/* Clouds */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/70 rounded-full animate-drift"
              style={{
                width: `${80 + i * 20}px`,
                height: `${40 + i * 10}px`,
                top: `${10 + i * 15}%`,
                left: `${10 + i * 15}%`,
                animationDelay: `${i * 2}s`,
              }}
            />
          ))}
        </>
      ) : (
        <>
          {/* Moon */}
          <div className="absolute top-10 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-2xl shadow-blue-500/30 animate-float" />
          
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 90}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
          
          {/* Great Bear constellation */}
          <svg className="absolute top-20 left-20 w-48 h-48 opacity-70" viewBox="0 0 200 200">
            <circle cx="50" cy="50" r="3" fill="white" className="animate-twinkle" />
            <circle cx="80" cy="60" r="3" fill="white" className="animate-twinkle" style={{ animationDelay: "0.5s" }} />
            <circle cx="110" cy="50" r="3" fill="white" className="animate-twinkle" style={{ animationDelay: "1s" }} />
            <circle cx="140" cy="65" r="3" fill="white" className="animate-twinkle" style={{ animationDelay: "1.5s" }} />
            <circle cx="100" cy="90" r="3" fill="white" className="animate-twinkle" style={{ animationDelay: "2s" }} />
            <circle cx="70" cy="100" r="3" fill="white" className="animate-twinkle" style={{ animationDelay: "2.5s" }} />
            <circle cx="50" cy="110" r="3" fill="white" className="animate-twinkle" style={{ animationDelay: "3s" }} />
            <line x1="50" y1="50" x2="80" y2="60" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="80" y1="60" x2="110" y2="50" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="110" y1="50" x2="140" y2="65" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="80" y1="60" x2="100" y2="90" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="100" y1="90" x2="70" y2="100" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="70" y1="100" x2="50" y2="110" stroke="white" strokeWidth="1" opacity="0.5" />
          </svg>
        </>
      )}

      {/* Desktop icons */}
      <div className="relative z-10 p-8 grid grid-cols-6 gap-6">
        {desktopIcons.map((icon) => (
          <div
            key={icon.id}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
            onDoubleClick={() => handleIconDoubleClick(icon.id, icon.name)}
          >
            <div className="text-foreground group-hover:scale-110 transition-transform">
              {icon.icon}
            </div>
            <span className="text-sm font-medium text-foreground drop-shadow-lg">
              {icon.name}
            </span>
          </div>
        ))}
      </div>

      {/* Windows */}
      {windows.map((window) => (
        <Window key={window.id} window={window}>
          {renderApp(window)}
        </Window>
      ))}
    </div>
  );
};
