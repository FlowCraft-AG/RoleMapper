//  Ähnlich wie bei bpmn-js musst man eine eigene Typdefinitionen erstellen, um den Typfehler zu beheben.

declare module 'dmn-js/lib/NavigatedViewer' {
  export default class DmnJS {
    constructor(options: { container: HTMLElement | undefined });
    importXML(xml: string): Promise<{ warnings: string[] }>;
    get<T = unknown>(name: string): T;
    destroy(): void;
  }

  export interface ViewerCanvas {
    zoom(level: string): void;
    getSize(): { width: number; height: number };
  }

  export interface ElementRegistry {
    get(elementId: string): unknown | null;
    filter(callback: (element: unknown) => boolean): unknown[];
  }
}
