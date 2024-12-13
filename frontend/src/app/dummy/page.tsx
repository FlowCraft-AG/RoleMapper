'use client';

import { useState } from 'react';

// Dummy-Verzeichnisstruktur für das Beispiel
const directoryStructure = {
  root: {
    name: 'Root',
    type: 'directory',
    children: [
      {
        name: 'Documents',
        type: 'directory',
        children: [
          { name: 'File1.txt', type: 'file' },
          { name: 'File2.txt', type: 'file' },
        ],
      },
      {
        name: 'Downloads',
        type: 'directory',
        children: [
          { name: 'FileA.zip', type: 'file' },
          { name: 'FileB.zip', type: 'file' },
        ],
      },
      {
        name: 'Pictures',
        type: 'directory',
        children: [
          { name: 'Image1.jpg', type: 'file' },
          { name: 'Image2.png', type: 'file' },
        ],
      },
    ],
  },
};

type DirectoryItem = {
  name: string;
  type: 'directory' | 'file';
  children?: DirectoryItem[];
};

export default function FinderView() {
  const [currentPath, setCurrentPath] = useState<DirectoryItem[]>([
    directoryStructure.root,
  ]); // Aktuelles Verzeichnis in der Navigation

  // Funktion, um in ein Verzeichnis zu navigieren
  const navigateToDirectory = (directory: DirectoryItem) => {
    if (directory.type === 'directory') {
      setCurrentPath((prevPath) => [...prevPath, directory]);
    }
  };

  // Funktion, um in das übergeordnete Verzeichnis zu gehen
  const goBack = () => {
    setCurrentPath((prevPath) => prevPath.slice(0, prevPath.length - 1));
  };

  return (
    <div className="d-flex">
      {/* Button zum Zurückgehen */}
      <button
        className="btn btn-secondary mb-4"
        onClick={goBack}
        disabled={currentPath.length === 1}
      >
        Zurück
      </button>

      {/* Spaltenansicht */}
      {currentPath.map((dir, index) => (
        <div key={index} className="column">
          <h3>{dir.name}</h3>
          <ul className="list-group">
            {dir.children?.map((child, idx) => (
              <li
                key={idx}
                className={`list-group-item ${child.type === 'directory' ? 'cursor-pointer' : ''}`}
                onClick={() =>
                  child.type === 'directory' && navigateToDirectory(child)
                }
              >
                {child.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
