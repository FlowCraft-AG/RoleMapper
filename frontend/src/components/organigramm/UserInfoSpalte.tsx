'use client';

import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchUserDetails } from '../../app/organisationseinheiten/fetchkp';
import { User } from '../../types/user.type';

interface UserInfoColumnProps {
  userId: string; // Der ausgewählte Benutzer
}

export default function UserInfoSpalte({ userId }: UserInfoColumnProps) {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
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

  //   const selectedUser = data?.getData.data[0];

  return (
    <Box sx={{ minHeight: 352, minWidth: 250, p: 2, paddingTop: 8 }}>
      <Typography>
        <strong>UserID:</strong> {selectedUser?.userId}
      </Typography>
      <Typography>
        <strong>Rolle:</strong> {selectedUser?.userRole}
      </Typography>
      <Typography>
        <strong>Typ:</strong> {selectedUser?.userType}
      </Typography>
      <Typography>
        <strong>Aktiv:</strong> {selectedUser?.active ? 'Ja' : 'Nein'}
      </Typography>
      <Typography>
        <strong>Gültig von:</strong> {selectedUser?.validFrom}
      </Typography>
      <Typography>
        <strong>Gültig bis:</strong> {selectedUser?.validUntil}
      </Typography>
      {selectedUser?.employee && (
        <>
          <Typography>
            <strong>Kostenstelle:</strong> {selectedUser?.employee.costCenter}
          </Typography>
          <Typography>
            <strong>Abteilung:</strong> {selectedUser?.employee.department}
          </Typography>
        </>
      )}
      {selectedUser?.student && (
        <>
          <Typography>
            <strong>Studiengang:</strong>{' '}
            {selectedUser?.student.courseOfStudyName}
          </Typography>
          <Typography>
            <strong>Prüfungsordnung:</strong>{' '}
            {selectedUser?.student.examRegulation}
          </Typography>
        </>
      )}
    </Box>
  );
}
