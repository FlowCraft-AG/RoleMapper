'use client';

import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { JSX, useEffect, useState } from 'react';
import { getRoles } from '../../lib/api/rolemapper/roles.api';
import { Process } from '../../types/process.type';
import { RoleResult, UserWithFunction } from '../../types/role-payload.type';

interface DebuggerViewProps {
  selectedProcess: Process;
}

export default function DebuggerView({
  selectedProcess,
}: DebuggerViewProps): JSX.Element {
  const [userId, setUserId] = useState<string>('');
  const [data, setData] = useState<RoleResult[]>();

  const handleFetchRoles = async () => {
    if (userId.trim()) {
      const data = await getRoles(selectedProcess._id, userId);
      setData(data);
    }
  };

    useEffect(() => {
      }, [selectedProcess]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        padding: 3,
        borderRadius: 4,
        boxShadow: `0px 8px 16px rgba(0, 0, 0, 0.1)`,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography
        variant="h5"
        textAlign="center"
        fontWeight="bold"
        sx={{
          marginBottom: 3,
          borderBottom: `2px solid`,
          borderImage: `linear-gradient(to right, #3f51b5, #2196f3) 1`,
          borderImageSlice: 1,
          paddingBottom: 1,
        }}
      >
        Debugger-Sicht
      </Typography>

      {/* Eingabefeld für Benutzer-ID */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Benutzer-ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchRoles}
          disabled={!userId.trim()}
          sx={{
            padding: '10px 20px',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Rollen abrufen
        </Button>
      </Box>

      {/* Tabelle mit Rollen */}
      {data && data.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            boxShadow: `0px 4px 8px rgba(0, 0, 0, 0.1)`,
            overflow: 'hidden',
            marginTop: 3,
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: 'primary.main',
                }}
              >
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Rollenname
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Benutzer
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Funktion
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((role: RoleResult, roleIndex: number) =>
                role.users.map(
                  (userEntry: UserWithFunction, userIndex: number) => (
                    <TableRow
                      key={`${roleIndex}-${userIndex}`}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          textAlign: 'center',
                          fontWeight: '500',
                        }}
                      >
                        {role.roleName}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        {userEntry.user.profile?.firstName ?? 'N/A'}
                        {' '}
                        {userEntry.user.profile?.lastName ?? 'N/A'}(
                        {userEntry.user.userId})
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        {userEntry.functionName}
                      </TableCell>
                    </TableRow>
                  ),
                ),
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Keine Daten */}
      {data && data.length === 0 && (
        <Typography textAlign="center" color="textSecondary">
          Keine Rollen gefunden.
        </Typography>
      )}
    </Box>
  );
}
