import { useState } from "react";
import { useFileSystem } from "@/contexts/FileSystemContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderPlus, FilePlus, Trash2, Home, ChevronRight, Edit } from "lucide-react";
import { toast } from "sonner";

export const FileExplorer = () => {
  const {
    files,
    currentPath,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    navigateTo,
    getCurrentFolder,
    getNodesByParent,
  } = useFileSystem();

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [renamingNode, setRenamingNode] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const currentFolder = getCurrentFolder();
  const nodes = getNodesByParent(currentFolder.id);

  const handleNavigate = (nodeId: string) => {
    const node = files[nodeId];
    if (node.type === "folder") {
      navigateTo([...currentPath, nodeId]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    navigateTo(currentPath.slice(0, index + 1));
  };

  const handleCreateFile = () => {
    const name = prompt("Enter file name:");
    if (name) {
      createFile(name);
      toast.success(`Created file: ${name}`);
    }
  };

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) {
      createFolder(name);
      toast.success(`Created folder: ${name}`);
    }
  };

  const handleDelete = (nodeId: string) => {
    const node = files[nodeId];
    if (confirm(`Delete ${node.name}?`)) {
      deleteNode(nodeId);
      toast.success(`Deleted: ${node.name}`);
      setSelectedNode(null);
    }
  };

  const handleRename = (nodeId: string) => {
    const node = files[nodeId];
    setRenamingNode(nodeId);
    setNewName(node.name);
  };

  const confirmRename = () => {
    if (renamingNode && newName.trim()) {
      renameNode(renamingNode, newName.trim());
      toast.success("Renamed successfully");
      setRenamingNode(null);
      setNewName("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-3 border-b border-border flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={handleCreateFile}>
          <FilePlus className="h-4 w-4 mr-2" />
          New File
        </Button>
        <Button size="sm" variant="secondary" onClick={handleCreateFolder}>
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
        {selectedNode && (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleRename(selectedNode)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Rename
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(selectedNode)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="p-3 border-b border-border flex items-center gap-1 text-sm">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigateTo(["root"])}
          className="h-7 px-2"
        >
          <Home className="h-4 w-4" />
        </Button>
        {currentPath.slice(1).map((pathId, index) => (
          <div key={pathId} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleBreadcrumbClick(index + 1)}
              className="h-7 px-2"
            >
              {files[pathId]?.name}
            </Button>
          </div>
        ))}
      </div>

      {/* File list */}
      <div className="flex-1 overflow-auto p-4">
        {nodes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Empty folder
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 ${
                  selectedNode === node.id
                    ? "border-primary bg-muted"
                    : "border-border"
                }`}
                onClick={() => setSelectedNode(node.id)}
                onDoubleClick={() =>
                  node.type === "folder" && handleNavigate(node.id)
                }
              >
                <div className="text-4xl mb-2">
                  {node.type === "folder" ? "📁" : "📄"}
                </div>
                {renamingNode === node.id ? (
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={confirmRename}
                    onKeyDown={(e) => e.key === "Enter" && confirmRename()}
                    autoFocus
                    className="h-7 text-xs"
                  />
                ) : (
                  <div className="text-sm font-medium truncate">
                    {node.name}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  {node.type}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
