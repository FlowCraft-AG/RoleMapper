'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import FunctionsColumn from './FunctionsColumn';
import OrgUnitRichTreeView from './OrgUnitRichTreeView';
import UserInfoColumn from './UserInfoColumn';
import UsersColumn from './UsersColumn';

export default function FourColumnView() {
  const [selectedOrgUnitId, setSelectedOrgUnitId] = useState<string | null>(
    null,
  );
  const [selectedFunctionId, setSelectedFunctionId] = useState<string | null>(
    null,
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [hasFunctions, setHasFunctions] = useState(false);

  const theme = useTheme(); // Zugriff auf das aktuelle Theme

  const handleOrgUnitSelect = (
    orgUnitId: string | null,
    hasFunctions: boolean,
  ) => {
    setSelectedOrgUnitId(orgUnitId);
    setHasFunctions(hasFunctions);
    setSelectedFunctionId(null);
    setSelectedUserId(null);
  };

  const handleFunctionSelect = (functionId: string) => {
    setSelectedFunctionId(functionId);
    setSelectedUserId(null);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      {/* Erste Spalte: Organisationseinheiten */}
      <Box
        sx={{
          minWidth: 250,
          borderRight: `1px solid ${theme.palette.divider}`,
          paddingRight: 2,
          marginRight: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Organisationseinheiten
        </Typography>
        <OrgUnitRichTreeView onSelect={handleOrgUnitSelect} />
      </Box>

      {/* Zweite Spalte: Funktionen */}
      {hasFunctions && selectedOrgUnitId && (
        <Box
          sx={{
            minWidth: 250,
            borderRight: `1px solid ${theme.palette.divider}`,
            paddingRight: 2,
            marginRight: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Funktionen
          </Typography>
          <FunctionsColumn
            selectedOrgUnitId={selectedOrgUnitId}
            onSelectFunction={handleFunctionSelect}
          />
        </Box>
      )}

      {/* Dritte Spalte: Benutzer-IDs */}
      {selectedFunctionId && (
        <Box
          sx={{
            minWidth: 250,
            borderRight: `1px solid ${theme.palette.divider}`,
            paddingRight: 2,
            marginRight: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Benutzer
          </Typography>
          <UsersColumn
            selectedFunctionId={selectedFunctionId}
            onSelectUser={handleUserSelect}
          />
        </Box>
      )}

      {/* Vierte Spalte: Benutzerinformationen */}
      {selectedUserId && (
        <Box sx={{ minWidth: 250 }}>
          <Typography variant="h6" gutterBottom>
            Benutzerinformationen
          </Typography>
          <UserInfoColumn selectedUserId={selectedUserId} />
        </Box>
      )}
    </Box>
  );
}
