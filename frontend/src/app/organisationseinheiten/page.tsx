'use client';

import { List, ListItemButton, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { User } from '../../types/user.type';
import { getListItemStyles } from '../../utils/styles';
import FunctionsColumn from './FunctionsColumn';
import OrgUnitRichTreeView from './OrgUnitRichTreeView';
import UserInfoColumn from './UserInfoColumn';
import UsersColumn from './UsersColumn';

export default function FourColumnView() {
  const [selectedOrgUnitId, setSelectedOrgUnitId] = useState<string | null>(
    null,
  );
  const [selectedOrgUnitName, setSelectedOrgUnitName] = useState<string | null>(
    null,
  );
  const [selectedFunctionId, setSelectedFunctionId] = useState<string | null>(
    null,
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [combinedUsers, setCombinedUsers] = useState<User[]>([]); // Mitglieder der Organisationseinheit
  const [hasFunctions, setHasFunctions] = useState(false);
  const [hasMitglieder, setHasMitglieder] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [selectedOrgUnitType, setSelectedOrgUnitType] = useState<string | null>(
    null,
  );

  const theme = useTheme(); // Zugriff auf das aktuelle Theme

  const handleOrgUnitSelect = (
    orgUnitId: string,
    hasFunctions: boolean,
    mitglieder: User[],
    totalCount: number,
    orgUnitName: string,
    orgUnitType: string,
  ) => {
    const hasMitglieder = totalCount > 0;
    setSelectedOrgUnitId(orgUnitId);
    setSelectedOrgUnitName(orgUnitName || null);
    setHasFunctions(hasFunctions);
    setHasMitglieder(hasMitglieder);
    setSelectedFunctionId(null);
    setSelectedUserId(null);
    setCombinedUsers(mitglieder);
    setSelectedOrgUnitType(orgUnitType || null);
    setSelectedIndex(null); // Reset selection when switching org units
  };

  const handleFunctionSelect = (functionId: string) => {
    setSelectedFunctionId(functionId);
    setSelectedUserId(null);
    setSelectedIndex(functionId); // Highlight selection
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleMitgliederClick = () => {
    setSelectedFunctionId(null); // Reset functions
    setSelectedUserId(null); // Reset users
    setSelectedIndex('mitglieder'); // Highlight selection for Mitglieder
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
        <OrgUnitRichTreeView
          onSelect={(id, hasFunctions, mitglieder, totalCount, name, type) =>
            handleOrgUnitSelect(
              id,
              hasFunctions,
              mitglieder,
              totalCount,
              name,
              type,
            )
          }
        />
      </Box>

      {/* Zweite Spalte: Funktionen */}
      {(hasFunctions || hasMitglieder) && selectedOrgUnitId && (
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
          {/* Zusätzlicher Listeneintrag für Mitglieder */}
          {hasMitglieder && (
            <List>
              <ListItemButton
                key="mitglieder"
                selected={selectedIndex === 'mitglieder'}
                onClick={handleMitgliederClick}
                aria-selected={selectedIndex === 'mitglieder'}
                sx={getListItemStyles(theme, selectedIndex === 'mitglieder')}
              >
                <ListItemText
                  primary={`Mitglieder der ${selectedOrgUnitType} ${selectedOrgUnitName}`}
                />
              </ListItemButton>
            </List>
          )}
        </Box>
      )}

      {/* Dritte Spalte: Benutzer-IDs */}
      {(selectedIndex === 'mitglieder' || selectedFunctionId) && (
        <Box
          sx={{
            minWidth: 250,
            borderRight: `1px solid ${theme.palette.divider}`,
            paddingRight: 2,
            marginRight: 2,
            maxHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
            position: 'sticky',
            top: 0, // Überschrift bleibt oben
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 0, // Überschrift bleibt oben
              backgroundColor: theme.palette.background.default, // Hintergrundfarbe für die Überschrift
              zIndex: 1,
              padding: 1,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Benutzer
            </Typography>
          </Box>
          {selectedIndex === 'mitglieder' ? (
            <List>
              {combinedUsers.map((user) => (
                <ListItemButton
                  key={user.userId}
                  onClick={() => handleUserSelect(user.userId)}
                  selected={selectedUserId === user.userId}
                  sx={getListItemStyles(theme, selectedUserId === user.userId)}
                >
                  <ListItemText primary={user.userId} />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <UsersColumn
              selectedFunctionId={selectedFunctionId!}
              onSelectUser={handleUserSelect}
            />
          )}
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
