'use client';

import { useQuery } from '@apollo/client';
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { USERS_BY_FUNCTION } from '../../graphql/queries/get-functions';
import { USER_DETAILS } from '../../graphql/queries/get-users';
import { client } from '../../lib/apolloClient';
import { User } from '../../types/user.type';

interface UserTableProps {
  selectedFunctionId: string;
}

export default function UserTable({ selectedFunctionId }: UserTableProps) {
  // Fetch users by function
  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(USERS_BY_FUNCTION, {
    client,
    variables: { functionId: selectedFunctionId },
    skip: !selectedFunctionId,
  });

  // Fetch details for all users in the list
  const userIds = usersData?.getData?.data || [];
  const {
    loading: detailsLoading,
    error: detailsError,
    data: userDetailsData,
  } = useQuery(USER_DETAILS, {
    client,
    variables: { userIds },
    skip: userIds.length === 0,
  });

  if (usersLoading || detailsLoading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100%',
          p: 2,
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (usersError || detailsError)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Fehler: {(usersError || detailsError)?.message}
        </Alert>
      </Box>
    );

  const usersDetails = userDetailsData?.getData?.data || [];

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography
          variant="h5"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Benutzerinformationen
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Benutzer-ID
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Aktiv
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Gültig von
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Gültig bis
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Rolle
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersDetails.map((user: User) => (
                <TableRow
                  key={user.userId}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                  }}
                >
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>
                    {user.active ? (
                      <Typography color="success.main">Ja</Typography>
                    ) : (
                      <Typography color="error.main">Nein</Typography>
                    )}
                  </TableCell>
                  <TableCell>{user.validFrom || '–'}</TableCell>
                  <TableCell>{user.validUntil || '–'}</TableCell>
                  <TableCell>{user.userRole || '–'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
