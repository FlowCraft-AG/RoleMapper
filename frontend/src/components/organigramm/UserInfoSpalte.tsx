import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { fetchUserDetails } from '../../app/organisationseinheiten/fetchkp';
import { User } from '../../types/user.type';

interface UserInfoColumnProps {
  userId: string; // Der ausgewählte Benutzer
}

export default function UserInfoSpalte({ userId }: UserInfoColumnProps) {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userDetails = await fetchUserDetails(userId);
      console.log('userDetails: ', userDetails);
      setSelectedUser(userDetails);
    } catch (err) {
      console.error('Fehler beim Laden der Benutzerdetails:', err);
      setError('Fehler beim Laden der Benutzerdetails.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, fetchData]);

  const formatDate = (timestamp: string | undefined) => {
    if (!timestamp) return 'Nicht verfügbar';
    const numericTimestamp = parseInt(timestamp, 10);
    if (isNaN(numericTimestamp)) return 'Ungültiges Datum';
    return new Date(numericTimestamp).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Fehler: {error}</Alert>
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: 352,
        minWidth: 300,
        p: 2,
        paddingTop: 4,
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
