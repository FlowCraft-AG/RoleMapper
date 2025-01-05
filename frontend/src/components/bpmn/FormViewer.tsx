/**
 * @file FormViewer.tsx
 * @description React-Komponente zur Anzeige und Interaktion mit Formularen im `.form`-Format.
 *
 * @module FormViewer
 */

'use client';

import { Form, FormSubmitEvent } from '@bpmn-io/form-js'; // Importiere die Typen
import { useEffect, useRef } from 'react';

/**
 * Props für die `FormViewer`-Komponente.
 *
 * @interface FormViewerProps
 * @property {string} formJSON - JSON-String, der die `.form`-Datei repräsentiert.
 */
interface FormViewerProps {
  formJSON: string; // JSON-String der `.form`-Datei
}

/**
 * `FormViewer`-Komponente
 *
 * Diese Komponente rendert ein Formular basierend auf einem JSON-Schema,
 * das aus einer `.form`-Datei stammt. Die Komponente unterstützt Ereignisse
 * wie das Absenden des Formulars und zeigt eine automatische Fehlermeldung
 * bei Problemen.
 *
 * @component
 * @param {FormViewerProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur für die Anzeige des Formulars.
 *
 * @example
 * ```tsx
 * <FormViewer formJSON="{...}" />
 * ```
 */
export default function FormViewer({ formJSON }: FormViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Effekt, der das Formular initialisiert, lädt und Ereignisse behandelt.
   */

  useEffect(() => {
    const container = containerRef.current; // Lokale Kopie der Ref erstellen
    let formInstance: Form | null = null;

    /**
     * Lädt und initialisiert das Formular aus dem JSON-Schema.
     *
     * @async
     * @function loadForm
     */

    const loadForm = async () => {
      try {
        if (!formJSON) {
          console.error(
            'Die bereitgestellte .form-Datei ist leer oder undefined.',
          );
          return;
        }

        if (!container) {
          console.error('Der Container für das Formular ist nicht verfügbar.');
          return;
        }

        // Parse JSON der `.form`-Datei
        const parsedSchema = JSON.parse(formJSON);
        console.log('Parsed .form Schema:', parsedSchema);

        // Initialisiere und lade das Formular
        formInstance = new Form({
          container,
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
      // Cleanup: Lokale Kopie verwenden
      if (formInstance) {
        formInstance.destroy();
      }

      if (container) {
        container.innerHTML = '';
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
