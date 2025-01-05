// src/types/form-js.d.ts

declare module '@bpmn-io/form-js' {
  export class Form {
    constructor(options: { container: HTMLElement });
    importSchema(schema: object): Promise<void>;
    on(event: string, callback: (event: FormSubmitEvent) => void): void;
    destroy(): void;
  }

  export interface FormSubmitEvent {
    data: Record<string, unknown>;
    errors: { message: string; field: string }[];
  }
}
