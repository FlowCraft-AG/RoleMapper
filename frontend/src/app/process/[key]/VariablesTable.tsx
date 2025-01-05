import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ProcessVariable } from '../../../types/process.type';

/**
 * Props für die `VariablesTable`-Komponente.
 * @typedef ProcessVariableProps
 * @property {ProcessVariable[]} variables - Die Prozessvariablen.
 */
interface ProcessVariableProps {
  variables: ProcessVariable[];
}

/**
 * `VariablesTable`-Komponente
 *
 * Zeigt eine Tabelle mit den Variablen einer Prozessinstanz an.
 *
 * @component
 * @param {Object} props - Eigenschaften der Komponente
 * @param {ProcessVariable[]} props.variables - Liste der Prozessvariablen
 * @returns {JSX.Element} Die JSX-Struktur der Variablentabelle
 *
 * @example
 * ```tsx
 * <VariablesTable variables={variables} />
 * ```
 */
export default function VariablesTable({ variables }: ProcessVariableProps) {
  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Variablen
      </Typography>
      <Divider sx={{ marginY: 1 }} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Wert</strong>
              </TableCell>
              <TableCell>
                <strong>Scope Key</strong>
              </TableCell>
              <TableCell>
                <strong>Truncated</strong>
              </TableCell>
              <TableCell>
                <strong>Tenant ID</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variables.map((variable) => (
              <TableRow key={variable.key}>
                <TableCell>{variable.name}</TableCell>
                <TableCell>{variable.value}</TableCell>
                <TableCell>{variable.scopeKey}</TableCell>
                <TableCell>{variable.truncated ? 'Ja' : 'Nein'}</TableCell>
                <TableCell>{variable.tenantId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
