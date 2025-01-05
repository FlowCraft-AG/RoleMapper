import { CheckCircle, Error, PendingActions } from '@mui/icons-material';
import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { ProcessTask } from '../../../types/process.type';

export default function TasksGrid({ tasks }: { tasks: ProcessTask[] }) {
  return (
    <Grid container spacing={3}>
      {tasks.map((task) => (
        <Grid item xs={12} sm={6} md={4} key={task.id}>
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
        </Grid>
      ))}
    </Grid>
  );
}
