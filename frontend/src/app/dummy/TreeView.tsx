'use client';

import React from 'react';

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

const TreeNode = ({ node }: { node: TreeNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div style={{ marginLeft: '20px' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        {isOpen ? '▼' : '▶'} {node.name}
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function TreeView({ data }: { data: TreeNode[] }) {
  return (
    <div>
      {data.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
}
