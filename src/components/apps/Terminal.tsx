import { useState, useRef, useEffect } from "react";
import { useFileSystem } from "@/contexts/FileSystemContext";

export const Terminal = () => {
  const [output, setOutput] = useState<string[]>(["PrathviOS Terminal v1.0", "Type 'help' for available commands", ""]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const {
    files,
    currentPath,
    createFile,
    createFolder,
    deleteNode,
    navigateTo,
    getCurrentFolder,
    getNodesByParent,
    moveNode,
    copyNode,
  } = useFileSystem();

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const addOutput = (text: string | string[]) => {
    const lines = Array.isArray(text) ? text : [text];
    setOutput((prev) => [...prev, ...lines]);
  };

  const getCurrentPathString = () => {
    return "/" + currentPath.slice(1).map((id) => files[id]?.name || id).join("/");
  };

  const executeCommand = (cmd: string) => {
    const [command, ...args] = cmd.trim().split(" ");
    addOutput(`$ ${cmd}`);

    switch (command) {
      case "help":
        addOutput([
          "Available commands:",
          "  ls              - List files and folders",
          "  cd <folder>     - Change directory",
          "  pwd             - Print working directory",
          "  mkdir <name>    - Create a new folder",
          "  touch <name>    - Create a new file",
          "  rm <name>       - Delete file or folder",
          "  cat <file>      - Display file content",
          "  mv <src> <dst>  - Move file or folder",
          "  cp <src> <dst>  - Copy file or folder",
          "  clear           - Clear terminal",
          "  help            - Show this help message",
          "",
        ]);
        break;

      case "ls":
        const currentFolder = getCurrentFolder();
        const nodes = getNodesByParent(currentFolder.id);
        if (nodes.length === 0) {
          addOutput("Empty directory");
        } else {
          const fileList = nodes.map((node) =>
            node.type === "folder" ? `📁 ${node.name}` : `📄 ${node.name}`
          );
          addOutput(fileList);
        }
        addOutput("");
        break;

      case "pwd":
        addOutput(getCurrentPathString());
        addOutput("");
        break;

      case "cd":
        if (!args[0]) {
          navigateTo(["root"]);
          addOutput("");
        } else if (args[0] === "..") {
          if (currentPath.length > 1) {
            navigateTo(currentPath.slice(0, -1));
          }
          addOutput("");
        } else {
          const targetFolder = getNodesByParent(getCurrentFolder().id).find(
            (node) => node.name === args[0] && node.type === "folder"
          );
          if (targetFolder) {
            navigateTo([...currentPath, targetFolder.id]);
            addOutput("");
          } else {
            addOutput(`cd: ${args[0]}: No such directory`);
            addOutput("");
          }
        }
        break;

      case "mkdir":
        if (!args[0]) {
          addOutput("mkdir: missing folder name");
        } else {
          createFolder(args[0]);
          addOutput(`Created folder: ${args[0]}`);
        }
        addOutput("");
        break;

      case "touch":
        if (!args[0]) {
          addOutput("touch: missing file name");
        } else {
          createFile(args[0], "");
          addOutput(`Created file: ${args[0]}`);
        }
        addOutput("");
        break;

      case "rm":
        if (!args[0]) {
          addOutput("rm: missing file or folder name");
        } else {
          const node = getNodesByParent(getCurrentFolder().id).find(
            (n) => n.name === args[0]
          );
          if (node) {
            deleteNode(node.id);
            addOutput(`Deleted: ${args[0]}`);
          } else {
            addOutput(`rm: ${args[0]}: No such file or directory`);
          }
        }
        addOutput("");
        break;

      case "cat":
        if (!args[0]) {
          addOutput("cat: missing file name");
        } else {
          const file = getNodesByParent(getCurrentFolder().id).find(
            (n) => n.name === args[0] && n.type === "file"
          );
          if (file) {
            addOutput(file.content || "(empty file)");
          } else {
            addOutput(`cat: ${args[0]}: No such file`);
          }
        }
        addOutput("");
        break;

      case "mv":
      case "cp":
        if (args.length < 2) {
          addOutput(`${command}: missing source or destination`);
        } else {
          const sourceNode = getNodesByParent(getCurrentFolder().id).find(
            (n) => n.name === args[0]
          );
          const targetFolder = getNodesByParent(getCurrentFolder().id).find(
            (n) => n.name === args[1] && n.type === "folder"
          );
          
          if (!sourceNode) {
            addOutput(`${command}: ${args[0]}: No such file or directory`);
          } else if (!targetFolder) {
            addOutput(`${command}: ${args[1]}: No such directory`);
          } else {
            if (command === "mv") {
              moveNode(sourceNode.id, targetFolder.id);
              addOutput(`Moved ${args[0]} to ${args[1]}`);
            } else {
              copyNode(sourceNode.id, targetFolder.id);
              addOutput(`Copied ${args[0]} to ${args[1]}`);
            }
          }
        }
        addOutput("");
        break;

      case "clear":
        setOutput([]);
        break;

      case "":
        addOutput("");
        break;

      default:
        addOutput(`${command}: command not found`);
        addOutput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setCommandHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);
      executeCommand(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-card/90 p-4 font-mono text-sm">
      <div ref={outputRef} className="flex-1 overflow-y-auto mb-4 space-y-1">
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-primary">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none"
          autoFocus
          spellCheck={false}
        />
      </form>
    </div>
  );
};
