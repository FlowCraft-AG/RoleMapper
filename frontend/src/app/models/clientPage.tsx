'use client';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import BpmnViewer from '../../components/bpmn/BpmnViewer';
import DmnViewer from '../../components/bpmn/DmnViewer';
import FormViewer from '../../components/bpmn/FormViewer';

type File = { name: string; content: string };
type Props = {
  bpmnFiles: File[];
  formFiles: File[];
  dmnFiles: File[];
};

export default function ClientPage({ bpmnFiles, formFiles, dmnFiles }: Props) {
  const [selectedType, setSelectedType] = useState<'bpmn' | 'form' | 'dmn'>(
    'bpmn',
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(
    bpmnFiles[0] || null,
  );

  const fileList =
    selectedType === 'bpmn'
      ? bpmnFiles
      : selectedType === 'form'
        ? formFiles
        : dmnFiles;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Camunda Dateien
      </Typography>

      <Tabs
        value={selectedType}
        onChange={(event, newValue) => {
          setSelectedType(newValue);
          const initialFile =
            newValue === 'bpmn'
              ? bpmnFiles[0]
              : newValue === 'form'
                ? formFiles[0]
                : dmnFiles[0];
          setSelectedFile(initialFile || null);
        }}
        textColor="primary"
        indicatorColor="primary"
        sx={{ marginBottom: 4 }}
      >
        <Tab value="bpmn" label="BPMN" />
        <Tab value="form" label="Forms" />
        <Tab value="dmn" label="DMNs" />
      </Tabs>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Dateien
            </Typography>
            <List>
              {fileList.map((file) => (
                <ListItemButton
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  selected={selectedFile?.name === file.name}
                  sx={{
                    borderRadius: 1,
                    marginBottom: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                  }}
                >
                  <ListItemText primary={file.name} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedFile ? (
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardHeader
                title={selectedFile.name}
                subheader={`Typ: ${selectedType.toUpperCase()}`}
              />
              <CardContent sx={{ height: '500px', overflow: 'auto' }}>
                {selectedType === 'bpmn' && (
                  <BpmnViewer diagramXML={selectedFile.content} />
                )}
                {selectedType === 'form' && (
                  <FormViewer formJSON={selectedFile.content} />
                )}
                {selectedType === 'dmn' && (
                  <DmnViewer diagramXML={selectedFile.content} />
                )}
              </CardContent>
            </Card>
          ) : (
            <Card
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1" color="textSecondary">
                Wähle eine Datei aus, um den Inhalt anzuzeigen.
              </Typography>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
