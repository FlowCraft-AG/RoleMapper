//  Ähnlich wie bei bpmn-js musst man eine eigene Typdefinitionen erstellen, um den Typfehler zu beheben.

declare module 'dmn-js/lib/NavigatedViewer' {
  /**
   * Hauptklasse für den DMN-Viewer.
   */
  export default class DmnJS {
    /**
     * Erstellt eine neue Instanz des DMN-Viewers.
     * @param options - Konfigurationsoptionen für den Viewer, z. B. Container-Element.
     */
    constructor(options: { container: HTMLElement | undefined });
    /**
     * Importiert ein DMN-Diagramm im XML-Format.
     * @param xml - Der XML-Inhalt des DMN-Diagramms.
     * @returns Ein Promise, das Warnungen zurückgibt.
     */
    importXML(xml: string): Promise<{ warnings: string[] }>;
    /**
     * Ruft ein Modul oder eine Komponente des Viewers ab.
     * @param name - Der Name des Moduls.
     * @returns Das Modul vom Typ `T`, wenn verfügbar.
     */
    get<T = unknown>(name: string): T;
    /**
     * Zerstört die Instanz des DMN-Viewers und gibt Ressourcen frei.
     */
    destroy(): void;
  }

  /**
   * Schnittstelle für Canvas-Operationen.
   */
  export interface ViewerCanvas {
    /**
     * Passt die Zoomstufe des Diagramms an.
     * @param level - Die gewünschte Zoomstufe (z. B. "fit-viewport").
     */

    zoom(level: string): void;
    /**
     * Gibt die Größe des Canvas zurück.
     * @returns Ein Objekt mit `width` und `height`.
     */

    getSize(): { width: number; height: number };
  }

  /**
   * Schnittstelle für das Element-Register.
   */
  export interface ElementRegistry {
    /**
     * Ruft ein Diagrammelement anhand seiner ID ab.
     * @param elementId - Die ID des Elements.
     * @returns Das Element oder `null`, falls es nicht gefunden wird.
     */
    get(elementId: string): unknown | null;
    /**
     * Filtert Elemente basierend auf einer Bedingung.
     * @param callback - Die Funktion, die jedes Element überprüft.
     * @returns Eine Liste von Elementen, die der Bedingung entsprechen.
     */
    filter(callback: (element: unknown) => boolean): unknown[];
  }
}
