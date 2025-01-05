// Der Fehler tritt auf, weil TypeScript keine Typdeklarationen für bpmn - js / dist / bpmn - navigated - viewer.production.min.js findet.
// Dieses Problem kann behoben werden, indem man die Typen selbst hinzufügst.

declare module 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js' {
  export class BpmnJS {
    constructor(options: { container: HTMLElement | undefined });
    /**
     * Importiert ein BPMN-Diagramm im XML-Format.
     * @param xml - Der XML-Inhalt des BPMN-Diagramms.
     * @returns Ein Promise, das entweder erfolgreich ist oder Fehler zurückgibt.
     */

    importXML(xml: string): Promise<void>;
    /**
     * Ruft ein spezifisches Modul innerhalb des Viewers ab.
     * @param module - Der Name des Moduls.
     * @returns Das Modul, das vom Typ `T` sein kann.
     */
    get<T>(module: string): T;
    /**
     * Zerstört die Instanz und gibt Ressourcen frei.
     */
    destroy(): void;
  }

  import Viewer from 'bpmn-js';
  export default Viewer;

  export interface ElementRegistry {
    /**
     * Sucht ein Element anhand seiner ID.
     * @param elementId - Die ID des Elements.
     * @returns Das Element oder `null`, falls es nicht gefunden wird.
     */
    get(elementId: string): unknown | null;
    /**
     * Filtert Elemente basierend auf einer bereitgestellten Funktion.
     * @param fn - Die Filterfunktion.
     * @returns Eine Liste von Elementen, die dem Filter entsprechen.
     */
    filter(fn: (element: unknown) => boolean): unknown[];
  }

  export interface Canvas {
    /**
     * Setzt die Zoomstufe des Diagramms.
     * @param level - Die gewünschte Zoomstufe (z. B. 'fit-viewport').
     */
    zoom(level: string): void;
    /**
     * Fügt einem Element eine CSS-Klasse hinzu.
     * @param elementId - Die ID des Elements.
     * @param className - Der Name der CSS-Klasse.
     */
    addMarker(elementId: string, className: string): void;
    /**
     * Entfernt eine CSS-Klasse von einem Element.
     * @param elementId - Die ID des Elements.
     * @param className - Der Name der CSS-Klasse.
     */
    removeMarker(elementId: string, className: string): void;
    /**
     * Gibt die SVG-Grafik für ein Element zurück.
     * @param elementId - Die ID des Elements.
     * @returns Die zugehörige SVG-Grafik.
     */
    getGraphics(elementId: string): SVGElement;
  }
}
