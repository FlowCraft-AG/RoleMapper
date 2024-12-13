'use client';

import { useQuery } from '@apollo/client';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FUNCTIONS } from '../../graphql/queries/get-functions';
import client from '../../lib/apolloClient';
import { getListItemStyles } from '../../utils/styles';
import React from 'react';
import theme from '../../theme';

export type Function = {
  _id: string;
  functionName: string;
  users: string[];
  orgUnit: string;
};

interface UsersColumnProps {
  selectedFunctionId: string;
  onSelectUser: (userId: string) => void;
}

export default function UsersColumn({
  selectedFunctionId,
  onSelectUser,
}: UsersColumnProps) {
    const { loading, error, data } = useQuery(FUNCTIONS, { client });
    const [selectedIndex, setSelectedIndex] = React.useState<string | null>(
      null,
    );

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Fehler: {error.message}</Alert>
      </Box>
    );

  // Funktion suchen
  const selectedFunction: Function | undefined = data?.getData?.data?.find(
    (func: Function) => func._id === selectedFunctionId,
  );

  if (!selectedFunction || selectedFunction.users.length === 0)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">Keine Benutzer verfügbar.</Alert>
      </Box>
    );

    const handleClick = (userId: string) => {
      setSelectedIndex(userId);
      if (onSelectUser) {
        onSelectUser(userId);
      }
    };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250, p: 2 }}>
      <List>
        {selectedFunction.users.map((userId) => (
          <ListItemButton
            key={userId}
            onClick={() => handleClick(userId)}
            selected={selectedIndex === userId}
            sx={getListItemStyles(theme, selectedIndex === userId)}
          >
            <ListItemText primary={userId} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
