'use client';

import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import BpmnJS, {
  Canvas,
  ElementRegistry,
} from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js'; // Import mit Typen
import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/BpmnViewer.module.css';

interface BpmnViewerProps {
  diagramXML?: string;
  diagramURL?: string;
  activeElementId?: string;
  onLoading?: () => void;
  onError?: (err: Error) => void;
  onShown?: (warnings: string[]) => void;
}

const BpmnViewer: React.FC<BpmnViewerProps> = ({
  diagramXML,
  diagramURL,
  activeElementId,
  onLoading,
  onError,
  onShown,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bpmnViewer = new BpmnJS({
      container: containerRef.current || undefined,
    });

    const loadDiagram = async () => {
      try {
        setLoading(true);
        setError(null);
        onLoading?.();

        if (diagramXML) {
          await bpmnViewer.importXML(diagramXML);
        } else if (diagramURL) {
          const response = await fetch(diagramURL);
          if (!response.ok) {
            throw new Error(`Fehler beim Laden der Datei: ${response.status}`);
          }
          const xml = await response.text();
          await bpmnViewer.importXML(xml);
        } else {
          throw new Error('Keine Diagrammdaten bereitgestellt.');
        }

        const canvas: Canvas = bpmnViewer.get('canvas');
        const elementRegistry: ElementRegistry =
          bpmnViewer.get('elementRegistry');

        // Diagramm anpassen
        canvas.zoom('fit-viewport');

        // Aktive Aktivität hervorheben
        if (activeElementId) {
          const element = elementRegistry.get(activeElementId);
          if (element) {
            canvas.addMarker(activeElementId, styles['bpmn-highlight']);
          }
          // Debug: Grafik direkt bearbeiten
          const gfx = canvas.getGraphics(activeElementId);
          const visual = gfx.querySelector('.djs-visual');
          if (visual) {
            visual.querySelectorAll('*').forEach((child) => {
              const styledChild = child as HTMLElement & {
                style: { stroke: string };
              };
              styledChild.style.stroke = 'green';
              //child.style.stroke = 'green';
              // child.style.strokeWidth = '2px';
            });
          }
        }

        onShown?.([]);
      } catch (err) {
        const errorMessage = (err as Error).message || 'Unbekannter Fehler';
        setError(errorMessage);
        onError?.(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadDiagram();

    return () => {
      bpmnViewer.destroy();
    };
  }, [diagramXML, diagramURL, onLoading, onError, onShown, activeElementId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '500px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '500px',
        }}
      >
        <Alert severity="error">{error}</Alert>
        <Typography variant="body2" color="textSecondary" mt={2}>
          Überprüfe die Datei oder URL und versuche es erneut.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '500px',
        border: '1px solid #ddd',
        borderRadius: '4px',
      }}
    />
  );
};

export default BpmnViewer;
