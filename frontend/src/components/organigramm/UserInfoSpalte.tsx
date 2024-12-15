'use client';

import { useQuery } from '@apollo/client';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { USER_DETAILS } from '../../graphql/queries/get-users';
import client from '../../lib/apolloClient';

interface UserInfoColumnProps {
  userId: string; // Der ausgewählte Benutzer
}

export default function UserInfoSpalte({ userId }: UserInfoColumnProps) {
  const { loading, error, data } = useQuery(USER_DETAILS, {
    variables: { userId },
    client,
  });

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

  const selectedUser = data?.getData.data[0];

  return (
    <Box sx={{ minHeight: 352, minWidth: 250, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Benutzerinformationen
      </Typography>
      <Typography>
        <strong>UserID:</strong> {selectedUser.userId}
      </Typography>
      <Typography>
        <strong>Rolle:</strong> {selectedUser.userRole}
      </Typography>
      <Typography>
        <strong>Typ:</strong> {selectedUser.userType}
      </Typography>
      <Typography>
        <strong>Aktiv:</strong> {selectedUser.active ? 'Ja' : 'Nein'}
      </Typography>
      <Typography>
        <strong>Gültig von:</strong> {selectedUser.validFrom}
      </Typography>
      <Typography>
        <strong>Gültig bis:</strong> {selectedUser.validUntil}
      </Typography>
      {selectedUser.employee && (
        <>
          <Typography>
            <strong>Kostenstelle:</strong> {selectedUser.employee.costCenter}
          </Typography>
          <Typography>
            <strong>Abteilung:</strong> {selectedUser.employee.department}
          </Typography>
        </>
      )}
      {selectedUser.student && (
        <>
          <Typography>
            <strong>Studiengang:</strong>{' '}
            {selectedUser.student.courseOfStudyName}
          </Typography>
          <Typography>
            <strong>Prüfungsordnung:</strong>{' '}
            {selectedUser.student.examRegulation}
          </Typography>
        </>
      )}
    </Box>
  );
}
