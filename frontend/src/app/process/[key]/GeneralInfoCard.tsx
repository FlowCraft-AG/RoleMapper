import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { ProcessDetails } from '../../../types/process.type';

export default function GeneralInfoCard({
  details,
}: {
  details: ProcessDetails;
}) {
  return (
    <Card sx={{ marginBottom: 3 }}>
      <CardHeader
        title="Allgemeine Informationen"
        subheader={`Prozess-ID: ${details.bpmnProcessId}`}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Instanz-Key:</strong> {details.key}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {details.state}
            </Typography>
            <Typography variant="body1">
              <strong>Startdatum:</strong>{' '}
              {new Date(details.startDate).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Tenant ID:</strong> {details.tenantId}
            </Typography>
            <Typography
              variant="body1"
              color={details.incident ? 'error' : 'textSecondary'}
            >
              <strong>Vorfall:</strong> {details.incident ? 'Ja' : 'Nein'}
            </Typography>
            <Typography variant="body1">
              <strong>Prozessversion:</strong> {details.processVersion}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
