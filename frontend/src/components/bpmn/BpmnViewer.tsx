/**
 * @file BpmnViewer.tsx
 * @description React-Komponente zur Anzeige von BPMN-Diagrammen mit Unterstützung für XML-Dateien und URLs.
 *
 * @module BpmnViewer
 */

'use client';

import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import BpmnJS, {
  Canvas,
  ElementRegistry,
} from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js'; // Import mit Typen
import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/BpmnViewer.module.css';

/**
 * Props für die `BpmnViewer`-Komponente.
 *
 * @interface BpmnViewerProps
 * @property {string} [diagramXML] - Der XML-Inhalt des Diagramms als String.
 * @property {string} [diagramURL] - Eine URL, von der das Diagramm geladen wird.
 * @property {string} [activeElementId] - Die ID eines Elements im Diagramm, das hervorgehoben werden soll.
 * @property {() => void} [onLoading] - Callback, der aufgerufen wird, wenn das Diagramm geladen wird.
 * @property {(err: Error) => void} [onError] - Callback, der aufgerufen wird, wenn ein Fehler auftritt.
 * @property {(warnings: string[]) => void} [onShown] - Callback, der aufgerufen wird, wenn das Diagramm erfolgreich angezeigt wird.
 */
interface BpmnViewerProps {
  diagramXML?: string;
  diagramURL?: string;
  activeElementId?: string;
  incidentElementId?: string;
  onLoading?: () => void;
  onError?: (err: Error) => void;
  onShown?: (warnings: string[]) => void;
}

/**
 * `BpmnViewer`-Komponente
 *
 * Diese Komponente rendert BPMN-Diagramme basierend auf bereitgestellten XML-Daten oder einer URL.
 * Zusätzlich unterstützt sie die Hervorhebung eines bestimmten Elements im Diagramm.
 *
 * @component
 * @param {BpmnViewerProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des Diagramm-Viewers.
 *
 * @example
 * <BpmnViewer
 *   diagramXML="<bpmn:definitions ... />"
 *   activeElementId="Activity_1"
 *   onLoading={() => console.log('Diagramm wird geladen')}
 *   onError={(err) => console.error('Fehler:', err)}
 *   onShown={(warnings) => console.log('Diagramm angezeigt mit Warnungen:', warnings)}
 * />
 */
const BpmnViewer: React.FC<BpmnViewerProps> = ({
  diagramXML,
  diagramURL,
  activeElementId,
  incidentElementId,
  onLoading,
  onError,
  onShown,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Lädt das BPMN-Diagramm basierend auf XML oder URL und zeigt es an.
   *
   * @function loadDiagram
   * @async
   */
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

        // Falls keine spezifischen IDs definiert sind, alle Elemente grün hervorheben
        if (!activeElementId && !incidentElementId) {
          const elementRegistry: ElementRegistry =
            bpmnViewer.get('elementRegistry');
          const elements = elementRegistry.getAll(); // Alle Elemente abrufen

          elements.forEach((element) => {
            const gfx = canvas.getGraphics(element.id); // Grafik des Elements abrufen
            const visual = gfx.querySelector('.djs-visual');
            if (visual) {
              visual.querySelectorAll('*').forEach((child) => {
                const styledChild = child as HTMLElement & {
                  style: { stroke: string };
                };
                styledChild.style.stroke = 'green'; // Elemente grün hervorheben
              });
            }
          });
        }

        // Aktive Aktivität hervorheben
        if (activeElementId) {
          console.log('BpmnViewer: activeElementID=', activeElementId);
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
              styledChild.style.stroke = 'blue';
              //child.style.stroke = 'green';
              // child.style.strokeWidth = '2px';
            });
          }
        }

        // Warnungen (Incidents) hervorheben
        if (incidentElementId) {
          console.log('BpmnViewer: incidentElementId=', incidentElementId);
          const element = elementRegistry.get(incidentElementId);
          if (element) {
            canvas.addMarker(incidentElementId, styles['bpmn-highlight']);
          }
          // Debug: Grafik direkt bearbeiten
          const gfx = canvas.getGraphics(incidentElementId);
          const visual = gfx.querySelector('.djs-visual');
          if (visual) {
            visual.querySelectorAll('*').forEach((child) => {
              const styledChild = child as HTMLElement & {
                style: { stroke: string };
              };
              styledChild.style.stroke = 'red';
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
  }, [
    diagramXML,
    diagramURL,
    onLoading,
    onError,
    onShown,
    activeElementId,
    incidentElementId,
  ]);

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
