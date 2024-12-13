'use client';

import { useQuery } from '@apollo/client';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { USERS } from '../../graphql/queries/get-users';
import client from '../../lib/apolloClient';

export type User = {
  _id: string;
  userId: string;
  userType: string;
  userRole: string;
  orgUnit: string;
  active: boolean;
  validFrom: string;
  validUntil: string;
  employee?: {
    costCenter: string;
    department: string;
  };
  student?: {
    _id: string;
    courseOfStudy: string;
    courseOfStudyUnique: string;
    courseOfStudyShort: string;
    courseOfStudyName: string;
    level: string;
    examRegulation: string;
  };
};

interface UserInfoColumnProps {
  selectedUserId: string;
}

export default function UserInfoColumn({
  selectedUserId,
}: UserInfoColumnProps) {
  const { loading, error, data } = useQuery(USERS, { client });

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

  // Benutzer suchen
  const selectedUser: User | undefined = data?.getData?.data?.find(
    (user: User) => user.userId === selectedUserId,
  );

  if (!selectedUser)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">Benutzerinformationen nicht verfügbar.</Alert>
      </Box>
    );

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
