'use client';

import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useState } from 'react';
import { ORG_UNITS } from '../../graphql/queries/get-orgUnits';
import client from '../../lib/apolloClient';
import theme from '../../theme';
import { OrgUnit, OrgUnitDTO } from '../../types/orgUnit.type';
import { getListItemStyles } from '../../utils/styles';

interface OrgUnitRichTreeViewProps {
  onSelect: (orgUnit: OrgUnitDTO) => void;
}

export default function OrgUnitsSpalte({ onSelect }: OrgUnitRichTreeViewProps) {
  const [expanded, setExpanded] = useState<string[]>([]); // Geöffnete Knoten

  const { data, loading, error } = useQuery(ORG_UNITS, {
    client,
  });

  if (loading) return <div>Lade Organisationseinheiten...</div>;
  if (error) return <div>Fehler beim Laden der Daten.</div>;

  // Prüfe, ob die Organisationseinheit ein Root-Knoten ist (z. B. IWI, EI, WW)
  const isRootOrgUnit = (orgUnit: OrgUnit) =>
    orgUnit?.alias || orgUnit?.kostenstelleNr;
  const orgUnitList: OrgUnit[] = data.getData.data;
  const treeData = buildTree(orgUnitList, null);

  // Baue die Tree-Datenstruktur
  function buildTree(
    data: OrgUnit[],
    parentId: string | null,
  ): TreeViewBaseItem[] {
    return data
      .filter((unit) => unit.parentId === parentId)
      .map((unit) => ({
        id: unit._id,
        label: unit.name,
        children: buildTree(data, unit._id),
      }));
  }

  const handleItemClick = (event: React.MouseEvent, nodeId: string) => {
    const selectedOrgUnit = orgUnitList.find((unit) => unit._id === nodeId);

    if (selectedOrgUnit) {
      if (isRootOrgUnit(selectedOrgUnit)) {
        onSelect({
          id: selectedOrgUnit._id,
          alias: selectedOrgUnit.alias || '',
          kostenstelleNr: selectedOrgUnit.kostenstelleNr || '',
          name: selectedOrgUnit.name,
          type: selectedOrgUnit.type,
        });
      } else {
        onSelect({
          id: selectedOrgUnit._id,
          name: selectedOrgUnit.name,
          parentId: selectedOrgUnit.parentId,
        });
      }
    }
  };

  const getParentNodes = (nodeId: string): string[] => {
    const parents: string[] = [];
    let current = orgUnitList.find((unit) => unit._id === nodeId);

    while (current && current.parentId) {
      parents.push(current.parentId);
      current = orgUnitList.find((unit) => unit._id === current?.parentId);
    }

    return parents;
  };

  const handleNodeToggle = async (
    _event: React.SyntheticEvent,
    nodeIds: string[],
  ) => {
    const lastExpandedNodeId = nodeIds[0];
    const lastExpandedOrgUnit = orgUnitList.find(
      (unit) => unit._id === lastExpandedNodeId,
    );
    // Finde Geschwister des zuletzt erweiterten Root-Knotens
    const siblings = orgUnitList.filter(
      (unit) =>
        unit.parentId === lastExpandedOrgUnit?.parentId &&
        unit._id !== lastExpandedOrgUnit._id,
    );
    // Überprüfe, ob ein Geschwister-Knoten in `nodeIds` enthalten ist
    const siblingExpanded = siblings.some((sibling) =>
      nodeIds.includes(sibling._id),
    );

    // IDs der Geschwisterknoten, die in nodeIds enthalten sind
    const foundSiblingIds = siblings
      .filter((sibling) => nodeIds.includes(sibling._id))
      .map((sibling) => sibling._id);

    // Funktion, um alle Kindknoten eines Knotens zu finden
    const getAllDescendantIds = (parentId: string): string[] => {
      const children = orgUnitList.filter((unit) => unit.parentId === parentId);
      const childIds = children.map((child) => child._id);
      return childIds.concat(
        childIds.flatMap((childId) => getAllDescendantIds(childId)),
      );
    };

      if (siblingExpanded) {
        // Schließe den ersten gefundenen Geschwisterknoten und seine Kinder
          const siblingToClose = foundSiblingIds[0];
          const descendantIds = siblingToClose
            ? getAllDescendantIds(siblingToClose)
              : [];
          const newNodeIds = nodeIds.filter(
            (id) => id !== siblingToClose && !descendantIds.includes(id),
          );
        // const newNodeIds = nodeIds.filter((id) => id !== foundSiblingIds[0]);
        setExpanded(newNodeIds);
      } else {
      setExpanded(nodeIds);
    }
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView
        items={treeData}
        expandedItems={expanded}
        onExpandedItemsChange={handleNodeToggle}
        onItemClick={handleItemClick}
        sx={{
          '& .MuiTreeItem-content': {
            ...getListItemStyles(theme, false), // Standardstile
          },
          '& .Mui-selected, & .Mui-selected-parents': {
            ...getListItemStyles(theme, true), // Ausgewähltes Element
          },
        }}
      />
    </Box>
  );
}
