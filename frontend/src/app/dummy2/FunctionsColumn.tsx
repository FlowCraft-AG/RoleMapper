'use client';

import { useQuery } from '@apollo/client';
import { ListItem, ListItemButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { FUNCTIONS } from '../../graphql/queries/get-functions';
import client from '../../lib/apolloClient';
import theme from '../../theme';
import { getListItemStyles } from '../../utils/styles';

export type Function = {
  _id: string;
  functionName: string;
  users: string[];
  orgUnit: string;
};

interface FunctionsColumnProps {
  selectedOrgUnitId: string | null;
  onSelectFunction?: (functionId: string) => void;
}

export default function FunctionsColumn({
  selectedOrgUnitId,
  onSelectFunction,
}: FunctionsColumnProps) {
  const {
    loading: loadingFunctions,
    error: errorFunctions,
    data: dataFunctions,
  } = useQuery(FUNCTIONS, { client });

  const [selectedIndex, setSelectedIndex] = React.useState<string | null>(null);

  // Ladezustand
  if (loadingFunctions)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );

  // Fehlerzustand
  if (errorFunctions)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Fehler: {errorFunctions.message}</Alert>
      </Box>
    );

  // Keine Organisationseinheit ausgewählt
  if (!selectedOrgUnitId)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">Wähle eine Organisationseinheit aus.</Alert>
      </Box>
    );

  // Funktionen filtern
  const filteredFunctions: Function[] =
    dataFunctions?.getData?.data?.filter(
      (func: Function) => func.orgUnit === selectedOrgUnitId,
    ) || [];

  // Klick-Handler für eine Funktion
  const handleClick = (functionId: string) => {
    setSelectedIndex(functionId);
    if (onSelectFunction) {
      onSelectFunction(functionId);
    }
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250, p: 2 }}>
      <List sx={{ padding: 0 }}>
        {filteredFunctions.length > 0 ? (
          filteredFunctions.map((func) => (
            <ListItemButton
              key={func._id}
              selected={selectedIndex === func._id}
              onClick={() => handleClick(func._id)}
              aria-selected={selectedIndex === func._id}
              sx={getListItemStyles(theme, selectedIndex === func._id)}
            >
              <ListItemText primary={func.functionName} />
            </ListItemButton>
          ))
        ) : (
          <ListItem sx={{ justifyContent: 'center', textAlign: 'center' }}>
            <ListItemText primary="Keine Funktionen verfügbar" />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
