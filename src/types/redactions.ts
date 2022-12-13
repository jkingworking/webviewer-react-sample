/**
 * @deprecated This should be refactored out when the redaction annotation object is updated
 */
export interface PdfRedaction {
  daggerSymbol: string | null;
  fontSize: number;
  height: number;
  isFullPage: boolean;
  padding: { x: number; y: number } | null;
  pageNumber: number;
  reason: string | null;
  variant: 'black' | 'white';
  width: number;
  x: number;
  y: number;
}

/**
 * @deprecated This should be refactored out when the redaction annotation object is updated
 */
export enum RedactionVariant {
  Black = 'black',
  White = 'white',
}
