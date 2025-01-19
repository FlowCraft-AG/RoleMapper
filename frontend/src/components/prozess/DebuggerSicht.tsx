'use client';

import {
  Alert,
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

/**
 * Properties für die DebuggerView component.
 */
interface DebuggerViewProps { 
  /** Der aktuell ausgewählte Prozess, für den die Rollen abgeholt werden sollen. */
  selectedProcess: Process;
}

/**
 * DebuggerView-Komponente zum Abrufen und Anzeigen von Benutzerrollen, die mit einem bestimmten Prozess verbunden sind.
 * 
 * @param {DebuggerViewProps} props - Komponenteneigenschaften.
 * @returns {JSX.Element} Die gerenderte DebuggerView-Komponente.
 */
export default function DebuggerView({
  selectedProcess,
}: DebuggerViewProps): JSX.Element 
  /** Die vom Benutzer eingegebene Benutzer-ID. */
  const [userId, setUserId] = useState<string>('');
  /** Die gefechten Rollendaten für den Benutzer. */
  const [data, setData] = useState<RoleResult[]>();
  /** error message. */
  const [error, setError] = useState<string | undefined>(undefined);

  /**
   * Handhabt den Abruf von Rollen für die angegebene Benutzer-ID und den Prozess.
   * Setzt Fehler- und Datenstatus vor dem Abruf zurück.
   * Zeigt eine Fehlermeldung an, wenn Rollen nicht abgerufen werden können oder ungültig sind.
   */
  const handleFetchRoles = async () => {
    setError(undefined); //  error state zurücksetzen
    setData(undefined); // Reset data zurücksetzen
    try {
      if (userId.trim()) {
        const fetchedData: RoleResult[] = await getRoles(
          selectedProcess._id,
          userId,
        );
        setData(data);
        console.log('Rollen:', fetchedData);
        if (!fetchedData || fetchedData.length === 0) {
          setError(`Für den Benutzer ${userId} wurden keine Rollen gefunden.`);
        } else if (
          fetchedData.some((role) => !role.users || role.users.length === 0)
        ) {
          setError(
            `Für einige Rollen des Benutzers ${userId} wurden keine Benutzer gefunden.`,
          );
        } else {
          setData(fetchedData);
        }
      } else {
        setError('Bitte geben Sie eine gültige Benutzer-ID ein.');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Rollen:', error);
      setError(error as string | undefined);
    }
  };

  /**
   * Resets error and data states when the selected process or user ID changes.
   */
  useEffect(() => {
    setError(undefined);
    setData(undefined);
  }, [selectedProcess, userId]);

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
        {selectedProcess.name}
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

      {/* Fehleranzeige */}
      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}

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
                  Kürzel
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
                        {userEntry.user.profile?.firstName ?? 'N/A'}{' '}
                        {userEntry.user.profile?.lastName ?? 'N/A'}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        {userEntry.user.userId}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        {userEntry.functionName ?? 'N/A'}
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
