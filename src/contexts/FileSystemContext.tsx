import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  parentId: string | null;
  children?: string[];
  createdAt: Date;
  modifiedAt: Date;
}

interface FileSystemContextType {
  files: Record<string, FileNode>;
  currentPath: string[];
  createFile: (name: string, content?: string) => void;
  createFolder: (name: string) => void;
  deleteNode: (id: string) => void;
  updateFile: (id: string, content: string) => void;
  renameNode: (id: string, newName: string) => void;
  navigateTo: (path: string[]) => void;
  getCurrentFolder: () => FileNode;
  getNodesByParent: (parentId: string | null) => FileNode[];
  getNodeById: (id: string) => FileNode | undefined;
  moveNode: (nodeId: string, targetParentId: string | null) => void;
  copyNode: (nodeId: string, targetParentId: string | null) => void;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 11);

export const FileSystemProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<Record<string, FileNode>>(() => {
    const saved = localStorage.getItem("prathvios-files");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      Object.keys(parsed).forEach((key) => {
        parsed[key].createdAt = new Date(parsed[key].createdAt);
        parsed[key].modifiedAt = new Date(parsed[key].modifiedAt);
      });
      return parsed;
    }
    
    // Initialize with root and pictures folder
    const rootId = "root";
    const picturesId = generateId();
    return {
      [rootId]: {
        id: rootId,
        name: "root",
        type: "folder",
        parentId: null,
        children: [picturesId],
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
      [picturesId]: {
        id: picturesId,
        name: "Pictures",
        type: "folder",
        parentId: rootId,
        children: [],
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
    };
  });

  const [currentPath, setCurrentPath] = useState<string[]>(["root"]);

  useEffect(() => {
    localStorage.setItem("prathvios-files", JSON.stringify(files));
  }, [files]);

  const getCurrentFolder = () => {
    const currentId = currentPath[currentPath.length - 1];
    return files[currentId];
  };

  const getNodesByParent = (parentId: string | null) => {
    return Object.values(files).filter((node) => node.parentId === parentId);
  };

  const getNodeById = (id: string) => files[id];

  const createFile = (name: string, content: string = "") => {
    const currentFolder = getCurrentFolder();
    const id = generateId();
    const newFile: FileNode = {
      id,
      name,
      type: "file",
      content,
      parentId: currentFolder.id,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };

    setFiles((prev) => ({
      ...prev,
      [id]: newFile,
      [currentFolder.id]: {
        ...currentFolder,
        children: [...(currentFolder.children || []), id],
        modifiedAt: new Date(),
      },
    }));
  };

  const createFolder = (name: string) => {
    const currentFolder = getCurrentFolder();
    const id = generateId();
    const newFolder: FileNode = {
      id,
      name,
      type: "folder",
      parentId: currentFolder.id,
      children: [],
      createdAt: new Date(),
      modifiedAt: new Date(),
    };

    setFiles((prev) => ({
      ...prev,
      [id]: newFolder,
      [currentFolder.id]: {
        ...currentFolder,
        children: [...(currentFolder.children || []), id],
        modifiedAt: new Date(),
      },
    }));
  };

  const deleteNode = (id: string) => {
    const node = files[id];
    if (!node) return;

    const deleteRecursive = (nodeId: string) => {
      const n = files[nodeId];
      if (n.type === "folder" && n.children) {
        n.children.forEach(deleteRecursive);
      }
      setFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[nodeId];
        return newFiles;
      });
    };

    // Remove from parent's children
    if (node.parentId) {
      const parent = files[node.parentId];
      setFiles((prev) => ({
        ...prev,
        [parent.id]: {
          ...parent,
          children: parent.children?.filter((childId) => childId !== id),
          modifiedAt: new Date(),
        },
      }));
    }

    deleteRecursive(id);
  };

  const updateFile = (id: string, content: string) => {
    const file = files[id];
    if (!file || file.type !== "file") return;

    setFiles((prev) => ({
      ...prev,
      [id]: {
        ...file,
        content,
        modifiedAt: new Date(),
      },
    }));
  };

  const renameNode = (id: string, newName: string) => {
    const node = files[id];
    if (!node) return;

    setFiles((prev) => ({
      ...prev,
      [id]: {
        ...node,
        name: newName,
        modifiedAt: new Date(),
      },
    }));
  };

  const navigateTo = (path: string[]) => {
    setCurrentPath(path);
  };

  const moveNode = (nodeId: string, targetParentId: string | null) => {
    const node = files[nodeId];
    if (!node || node.id === targetParentId) return;

    // Remove from old parent
    if (node.parentId) {
      const oldParent = files[node.parentId];
      setFiles((prev) => ({
        ...prev,
        [oldParent.id]: {
          ...oldParent,
          children: oldParent.children?.filter((id) => id !== nodeId),
        },
      }));
    }

    // Add to new parent
    const newParent = targetParentId ? files[targetParentId] : null;
    setFiles((prev) => ({
      ...prev,
      [nodeId]: {
        ...node,
        parentId: targetParentId,
      },
      ...(newParent && {
        [newParent.id]: {
          ...newParent,
          children: [...(newParent.children || []), nodeId],
        },
      }),
    }));
  };

  const copyNode = (nodeId: string, targetParentId: string | null) => {
    const node = files[nodeId];
    if (!node) return;

    const copyRecursive = (n: FileNode, parentId: string | null): string => {
      const newId = generateId();
      const newNode: FileNode = {
        ...n,
        id: newId,
        parentId,
        createdAt: new Date(),
        modifiedAt: new Date(),
        children: [],
      };

      if (n.type === "folder" && n.children) {
        const newChildren = n.children.map((childId) =>
          copyRecursive(files[childId], newId)
        );
        newNode.children = newChildren;
      }

      setFiles((prev) => ({
        ...prev,
        [newId]: newNode,
      }));

      return newId;
    };

    const newId = copyRecursive(node, targetParentId);

    // Add to parent
    if (targetParentId) {
      const parent = files[targetParentId];
      setFiles((prev) => ({
        ...prev,
        [parent.id]: {
          ...parent,
          children: [...(parent.children || []), newId],
        },
      }));
    }
  };

  return (
    <FileSystemContext.Provider
      value={{
        files,
        currentPath,
        createFile,
        createFolder,
        deleteNode,
        updateFile,
        renameNode,
        navigateTo,
        getCurrentFolder,
        getNodesByParent,
        getNodeById,
        moveNode,
        copyNode,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) throw new Error("useFileSystem must be used within FileSystemProvider");
  return context;
};
