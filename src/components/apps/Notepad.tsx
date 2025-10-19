import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, FolderOpen, Undo, Redo, Mic, MicOff } from "lucide-react";
import { useFileSystem } from "@/contexts/FileSystemContext";
import { toast } from "sonner";

interface NotepadProps {
  windowId: string;
}

export const Notepad = ({ windowId }: NotepadProps) => {
  const [content, setContent] = useState("");
  const [history, setHistory] = useState<string[]>([""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [fileName, setFileName] = useState("untitled.txt");
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const { createFile, updateFile, files } = useFileSystem();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        
        setContent(prev => prev + ' ' + transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error("Voice typing error");
      };
    }
  }, []);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setContent(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setContent(history[historyIndex + 1]);
    }
  };

  const toggleVoiceTyping = () => {
    if (!recognitionRef.current) {
      toast.error("Voice typing not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.success("Voice typing started");
    }
  };

  const handleSave = () => {
    if (currentFileId) {
      updateFile(currentFileId, content);
      toast.success(`File "${fileName}" updated`);
    } else {
      createFile(fileName, content);
      toast.success(`File "${fileName}" created`);
    }
  };

  const handleOpen = () => {
    const fileId = prompt("Enter file ID to open (check Files app):");
    if (fileId && files[fileId] && files[fileId].type === "file") {
      setContent(files[fileId].content || "");
      setFileName(files[fileId].name);
      setCurrentFileId(fileId);
      toast.success(`Opened "${files[fileId].name}"`);
    } else {
      toast.error("File not found");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-2 border-b border-border flex items-center gap-2">
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-48"
          placeholder="File name"
        />
        <Button size="sm" variant="secondary" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button size="sm" variant="secondary" onClick={handleOpen}>
          <FolderOpen className="h-4 w-4 mr-2" />
          Open
        </Button>
        <div className="flex-1" />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleUndo}
          disabled={historyIndex === 0}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRedo}
          disabled={historyIndex === history.length - 1}
        >
          <Redo className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={isListening ? "destructive" : "secondary"}
          onClick={toggleVoiceTyping}
        >
          {isListening ? (
            <MicOff className="h-4 w-4 mr-2" />
          ) : (
            <Mic className="h-4 w-4 mr-2" />
          )}
          {isListening ? "Stop" : "Voice"}
        </Button>
      </div>

      {/* Editor */}
      <Textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 font-mono"
        placeholder="Start typing or use voice typing..."
      />
    </div>
  );
};
