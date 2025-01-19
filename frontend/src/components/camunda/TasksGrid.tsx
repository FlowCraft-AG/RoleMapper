import { CheckCircle, Error, PendingActions } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  Grid2,
  Typography,
} from '@mui/material';
import { ProcessTask } from '../../types/process.type';

/**
 * Props für die `TasksGrid`-Komponente.
 * @typedef TasksGridProps
 * @property {ProcessTask[]} tasks - Die Aufgaben einer Prozessinstanz.
 */
interface TasksGridProps {
  tasks: ProcessTask[];
}

/**
 * `TasksGrid`-Komponente
 *
 * Zeigt ein Grid2 mit den Aufgaben einer Prozessinstanz an.
 *
 * @component
 * @param {Object} props - Eigenschaften der Komponente
 * @param {ProcessTask[]} props.tasks - Liste der Aufgaben
 * @returns {JSX.Element} Die JSX-Struktur des Grids
 *
 * @example
 * ```tsx
 * <TasksGrid tasks={tasks} />
 * ```
 */
export default function TasksGrid({ tasks }: TasksGridProps) {
  return (
    <Grid2 container spacing={3}>
      {tasks.map((task) => (
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
          <Card
            sx={{
              backgroundColor:
                task.taskState === 'COMPLETED'
                  ? '#e8f5e9'
                  : task.taskState === 'CREATED'
                    ? '#fffde7'
                    : '#ffffff',
            }}
          >
            <CardHeader
              title={task.name}
              subheader={`Status: ${task.taskState}`}
              avatar={
                task.taskState === 'COMPLETED' ? (
                  <CheckCircle color="success" />
                ) : task.taskState === 'CREATED' ? (
                  <PendingActions color="warning" />
                ) : (
                  <Error color="error" />
                )
              }
            />
            <CardContent>
              <Typography variant="body2">
                <strong>Erstellt:</strong>{' '}
                {new Date(task.creationDate).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Abgeschlossen:</strong>{' '}
                {task.completionDate
                  ? new Date(task.completionDate).toLocaleString()
                  : 'Nicht abgeschlossen'}
              </Typography>
              <Typography variant="body2">
                <strong>Assignee:</strong> {task.assignee || 'Nicht zugewiesen'}
              </Typography>
              <Typography variant="body2">
                <strong>Priorität:</strong> {task.priority}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
}
