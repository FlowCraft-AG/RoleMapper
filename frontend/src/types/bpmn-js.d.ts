// Der Fehler tritt auf, weil TypeScript keine Typdeklarationen für bpmn - js / dist / bpmn - navigated - viewer.production.min.js findet.
// Dieses Problem kann behoben werden, indem man die Typen selbst hinzufügst.

declare module 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js' {
  export class BpmnJS {
    constructor(options: { container: HTMLElement | undefined });
    importXML(xml: string): Promise<void>;
    get<T>(module: string): T;
    destroy(): void;
  }

  import Viewer from 'bpmn-js';
  export default Viewer;

  export interface Canvas {
    zoom(level: string): void;
    addMarker(elementId: string, className: string): void;
    removeMarker(elementId: string, className: string): void;
    getGraphics(elementId: string): SVGElement;
  }

  export interface ElementRegistry {
    get(elementId: string): unknown | null;
    filter(fn: (element: unknown) => boolean): unknown[];
  }

  export interface Canvas {
    zoom(level: string): void;
    addMarker(elementId: string, className: string): void;
    removeMarker(elementId: string, className: string): void;
    getGraphics(elementId: string): SVGElement;
  }

  export interface ElementRegistry {
    get(elementId: string): unknown | null;
    filter(callback: (element: unknown) => boolean): unknown[];
  }
}
