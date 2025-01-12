/**
 * @file ClientPage.tsx
 * @description Seite zur Anzeige von BPMN-, Form- und DMN-Dateien. Ermöglicht die Auswahl und Anzeige von Dateien basierend auf ihrem Typ.
 *
 * @module ClientPage
 */
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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import BpmnViewer from '../../components/bpmn/BpmnViewer';
import DmnViewer from '../../components/bpmn/DmnViewer';
import FormViewer from '../../components/bpmn/FormViewer';

/**
 * Typ für eine Datei mit Name und Inhalt.
 * @typedef {Object} File
 * @property {string} name - Der Name der Datei.
 * @property {string} content - Der Inhalt der Datei.
 */
interface File {
  name: string;
  content: string;
}

/**
 * Props für die `ClientPage`-Komponente.
 * @typedef {Object} Props
 * @property {File[]} bpmnFiles - Liste von BPMN-Dateien.
 * @property {File[]} formFiles - Liste von Formular-Dateien.
 * @property {File[]} dmnFiles - Liste von DMN-Dateien.
 */
interface Props {
  bpmnFiles: File[];
  formFiles: File[];
  dmnFiles: File[];
}

/**
 * Seite zur Anzeige von BPMN-, Form- und DMN-Dateien.
 *
 * @component
 * @param {Props} props - Die Eigenschaften der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur der Seite.
 *
 * @example
 * ```tsx
 * <ClientPage bpmnFiles={bpmnFiles} formFiles={formFiles} dmnFiles={dmnFiles} />
 * ```
 */
export default function ClientPage({ bpmnFiles, formFiles, dmnFiles }: Props) {
  const [selectedType, setSelectedType] = useState<'bpmn' | 'form' | 'dmn'>(
    'bpmn',
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Gibt die aktuelle Liste von Dateien basierend auf dem ausgewählten Typ zurück.
   * @returns {File[]} Die Liste von Dateien.
   */
  // `getFileList` wird mit `useCallback` optimiert
  const getFileList = useCallback(() => {
    switch (selectedType) {
      case 'bpmn':
        return bpmnFiles;
      case 'form':
        return formFiles;
      case 'dmn':
        return dmnFiles;
      default:
        return [];
    }
  }, [selectedType, bpmnFiles, formFiles, dmnFiles]);

  /**
   * Initialisiert die ausgewählte Datei basierend auf dem Typ.
   */
  useEffect(() => {
    const fileList = getFileList();
    setSelectedFile(fileList.length > 0 ? fileList[0] : null);
  }, [selectedType, bpmnFiles, formFiles, dmnFiles, getFileList]);

  const fileList = getFileList();

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Camunda Dateien
      </Typography>

      <Tabs
        value={selectedType}
        onChange={(event, newValue) => {
          setSelectedType(newValue);
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
            {fileList.length === 0 ? (
              <Typography variant="body1" color="textSecondary">
                Keine Dateien verfügbar.
              </Typography>
            ) : (
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
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedFile ? (
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardHeader
                title={selectedFile.name}
                subheader={`Typ: ${selectedType.toUpperCase()}`}
              />
              <CardContent
                sx={{
                  height: isSmallScreen ? '300px' : '500px',
                  overflow: 'auto',
                }}
              >
                {selectedType === 'bpmn' && (
                  <BpmnViewer
                    diagramXML={selectedFile.content}
                    activeElementId="n/a"
                    incidentElementId="n/a"
                  />
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
