import { ThemeProvider } from "@/contexts/ThemeContext";
import { FileSystemProvider } from "@/contexts/FileSystemContext";
import { WindowProvider } from "@/contexts/WindowContext";
import { Desktop } from "@/components/Desktop";
import { Taskbar } from "@/components/Taskbar";

const Index = () => {
  return (
    <ThemeProvider>
      <FileSystemProvider>
        <WindowProvider>
          <div className="h-screen w-screen overflow-hidden flex flex-col">
            <div className="flex-1 overflow-hidden">
              <Desktop />
            </div>
            <Taskbar />
          </div>
        </WindowProvider>
      </FileSystemProvider>
    </ThemeProvider>
  );
};

export default Index;
