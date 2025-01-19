/**
 * React-Komponente zur Anzeige von DMN-Diagrammen (Decision Model and Notation).
 *
 * @module DmnViewer
 */

'use client';

import DmnJS, { ViewerCanvas } from 'dmn-js/lib/NavigatedViewer';
import { useEffect, useRef } from 'react';

/**
 * Props für die `DmnViewer`-Komponente.
 *
 * @interface DmnViewerProps
 * @property {string} diagramXML - Der XML-Inhalt des DMN-Diagramms.
 */
interface DmnViewerProps {
  diagramXML: string;
}

/**
 * `DmnViewer`-Komponente
 *
 * Diese Komponente rendert DMN-Diagramme basierend auf bereitgestellten XML-Daten.
 *
 * @component
 * @param {DmnViewerProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des DMN-Viewers.
 *
 * @example
 * <DmnViewer diagramXML="<definitions ... />" />
 */
const DmnViewer: React.FC<DmnViewerProps> = ({ diagramXML }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Lädt das DMN-Diagramm und passt es an den Viewport an.
   *
   * @function loadDiagram
   * @async
   */
  useEffect(() => {
    const dmnViewer = new DmnJS({
      container: containerRef.current || undefined,
    });

    const loadDiagram = async () => {
      try {
        if (!diagramXML) {
          throw new Error('Keine Diagrammdaten bereitgestellt.');
        }

        await dmnViewer.importXML(diagramXML);

        const canvas: ViewerCanvas = dmnViewer.get('canvas');
        canvas.zoom('fit-viewport');
      } catch (err) {
        console.error('Fehler beim Laden des DMN-Diagramms:', err);
      }
    };

    loadDiagram();

    // Aufräumen bei Komponentenentfernung
    return () => {
      dmnViewer.destroy();
    };
  }, [diagramXML]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '500px',
        border: '1px solid #ddd',
        borderRadius: '4px',
      }}
    />
  );
};

export default DmnViewer;
