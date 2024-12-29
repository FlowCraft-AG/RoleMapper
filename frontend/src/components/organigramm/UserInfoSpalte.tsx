import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { fetchUserDetails } from '../../lib/api/user.api';
import { User } from '../../types/user.type';

interface UserInfoColumnProps {
  userId: string; // Der ausgewählte Benutzer
}

export default function UserInfoSpalte({ userId }: UserInfoColumnProps) {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // Benutzerinformationen abrufen
  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const userDetails = await fetchUserDetails(userId);
      setSelectedUser(userDetails);
    } catch (err) {
      console.error('Fehler beim Laden der Benutzerdetails:', err);
      setError('Fehler beim Laden der Benutzerdetails.');
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, fetchData]);

  // Datum formatieren
  const formatDate = (timestamp?: string) => {
    if (!timestamp) return 'Nicht verfügbar';
    const numericTimestamp = parseInt(timestamp, 10);
    return isNaN(numericTimestamp)
      ? 'Ungültiges Datum'
      : new Date(numericTimestamp).toLocaleDateString('de-DE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
  };

  // Fehleranzeige
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: 352,
        minWidth: 300,
        p: 2,
        pt: 4,
        backgroundColor: 'background.default',
        borderRadius: 4,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        overflow: 'auto',
        maxHeight: 'calc(100vh - 64px)',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          mb: 3,
          color: 'primary.main',
          borderBottom: `3px solid`,
          borderImage: `linear-gradient(to right, #ff5722, #2196f3) 1`,
          borderImageSlice: 1,
        }}
      >
        Benutzerinformationen
      </Typography>

      {selectedUser ? (
        <Card
          sx={{
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              <strong>UserID:</strong> {selectedUser.userId}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {selectedUser.profile && (
              <>
                <Typography variant="body1" gutterBottom>
                  <strong>Vorname:</strong> {selectedUser.profile.firstName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Nachname:</strong> {selectedUser.profile.lastName}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </>
            )}
            <Typography variant="body1" gutterBottom>
              <strong>Rolle:</strong> {selectedUser.userRole}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Typ:</strong> {selectedUser.userType}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Aktiv:</strong>{' '}
              {selectedUser.active ? (
                <Tooltip title="Benutzer ist aktiv">
                  <span style={{ color: 'green' }}>Ja</span>
                </Tooltip>
              ) : (
                <Tooltip title="Benutzer ist inaktiv">
                  <span style={{ color: 'red' }}>Nein</span>
                </Tooltip>
              )}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Gültig von:</strong> {formatDate(selectedUser.validFrom)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Gültig bis:</strong> {formatDate(selectedUser.validUntil)}
            </Typography>

            {selectedUser.employee && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" gutterBottom>
                  <strong>Kostenstelle:</strong>{' '}
                  {selectedUser.employee.costCenter}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Abteilung:</strong> {selectedUser.employee.department}
                </Typography>
              </>
            )}

            {selectedUser.student && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" gutterBottom>
                  <strong>Studiengang:</strong>{' '}
                  {selectedUser.student.courseOfStudyName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Prüfungsordnung:</strong>{' '}
                  {selectedUser.student.examRegulation}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Keine Benutzerinformationen verfügbar.
        </Typography>
      )}
    </Box>
  );
}
