'use client';

import DmnJS, { ViewerCanvas } from 'dmn-js/lib/NavigatedViewer';
import { useEffect, useRef } from 'react';

interface DmnViewerProps {
  diagramXML: string;
}

const DmnViewer: React.FC<DmnViewerProps> = ({ diagramXML }) => {
  const containerRef = useRef<HTMLDivElement>(null);

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
