/**
 * @module GeneralInfoCard
 * @description Diese Komponente zeigt allgemeine Informationen zu einer Prozessinstanz an.
 */

import {
  Card,
  CardContent,
  CardHeader,
  Grid2,
  Typography,
} from '@mui/material';
import { ProcessInstance } from '../../types/process.type';

/**
 * Props für die `GeneralInfoCard`-Komponente.
 * @typedef ProcessDetailsProps
 * @property {ProcessInstance} details - Die Prozessdetails.
 */
interface ProcessDetailsProps {
  details: ProcessInstance;
}

/**
 * `GeneralInfoCard`-Komponente
 *
 * Zeigt allgemeine Informationen zu einer Prozessinstanz an.
 *
 * @component
 * @param {Object} props - Eigenschaften der Komponente
 * @param {ProcessInstance} props.details - Die Prozessdetails
 * @returns {JSX.Element} Die JSX-Struktur der allgemeinen Informationen
 *
 * @example
 * ```tsx
 * <GeneralInfoCard details={details} />
 * ```
 */
export default function GeneralInfoCard({ details }: ProcessDetailsProps) {
  return (
    <Card sx={{ marginBottom: 3 }}>
      <CardHeader
        title={`Allgemeine Informationen zum ${details.name}-Prozess`}
        subheader={`Prozess-ID: ${details.bpmnProcessId}`}
      />
      <CardContent>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
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
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
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
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
}
