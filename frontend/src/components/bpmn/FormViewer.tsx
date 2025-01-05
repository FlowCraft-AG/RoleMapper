'use client';

import { Form, FormSubmitEvent } from '@bpmn-io/form-js'; // Importiere die Typen
import { useEffect, useRef } from 'react';

interface FormViewerProps {
  formJSON: string; // JSON-String der `.form`-Datei
}

export default function FormViewer({ formJSON }: FormViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let formInstance: Form | null = null;

    const loadForm = async () => {
      try {
        if (!formJSON) {
          console.error(
            'Die bereitgestellte .form-Datei ist leer oder undefined.',
          );
          return;
        }

        // Parse JSON der `.form`-Datei
        const parsedSchema = JSON.parse(formJSON);
        console.log('Parsed .form Schema:', parsedSchema);

        if (!containerRef.current) {
          console.error('Der Container für das Formular ist nicht verfügbar.');
          return;
        }

        // Initialisiere und lade das Formular
        formInstance = new Form({
          container: containerRef.current,
        });

        await formInstance.importSchema(parsedSchema);
        console.log('Formular erfolgreich geladen.');

        // Event: Beim Absenden des Formulars
        formInstance.on('submit', (event: FormSubmitEvent) => {
          console.log('Formular abgeschickt:', event.data);
          if (event.errors && event.errors.length > 0) {
            console.warn('Formularfehler:', event.errors);
          }
        });
      } catch (error) {
        console.error('Fehler beim Laden der .form-Datei:', error);
      }
    };

    loadForm();

    return () => {
      // Ressourcen bereinigen
      if (formInstance) {
        formInstance.destroy();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [formJSON]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '500px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '16px',
        backgroundColor: '#f9f9f9',
        overflow: 'auto',
      }}
    />
  );
}
