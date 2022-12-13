import { Core as PDFTronCore } from '@pdftron/webviewer';
import React from 'react';
import { PDFRendererEventWithDocumentIdMeta } from './customAnnotation/events';

export type OnEvent = (event: PDFRendererEventWithDocumentIdMeta) => void;

export type Overlay =
  | TextHighlightOverlay
  | LegendOverlay
  | RedactionOverlay
  | ContentOverlay;

export interface BaseOverlay {
  type: string;
  id: string;
  groupId?: string;
  pageNumber: number;
  jumpable?: boolean;
  jumpGroup?: string;
  visible?: boolean;
}

export interface OverlayStyle {
  backgroundColor: string;
  strokeColor: string;
  borderRadius?: number;
}

export interface LegendOverlay extends BaseOverlay {
  type: 'legendOverlay';
  height: number;
  textContent: string;
  isEditable: boolean;
  style: OverlayStyle;
  textColor: string;
  width: number;
  x: number;
  y: number;
}

export interface ContentOverlay extends BaseOverlay {
  type: 'contentOverlay';
  height: number;
  textContent: string;
  isResizeable: boolean;
  style: OverlayStyle;
  textColor: string;
  width: number;
  x: number;
  y: number;
}

export interface RedactionOverlayBase extends BaseOverlay {
  type: 'redactionOverlay';
  isEditable: boolean;
  legendSymbol: string;
  style: OverlayStyle;
  textColor: string;
  textContent: string;
}

export interface RedactionOverlayFullScreen extends RedactionOverlayBase {
  isFullPage: true;
}

export interface RedactionOverlaySetSize extends RedactionOverlayBase {
  isFullPage: false;
  height: number;
  width: number;
  x: number;
  y: number;
}

export type RedactionOverlay =
  | RedactionOverlayFullScreen
  | RedactionOverlaySetSize;

export interface TextHighlightOverlay extends BaseOverlay {
  type: 'textHighlightOverlay';
  color: string;
  occurrence: number;
  text: string;
}

export type CreateOverlayRedactionTool = {
  tool: 'CreateOverlayRedactionTool';
  legendSymbol: string;
  style: OverlayStyle;
  textColor: string;
  textContent: string;
};

export type CreateOverlayAnnotationTool = {
  tool: 'CreateOverlayAnnotationTool';
  style: OverlayStyle;
  textColor: string;
  textContent: string;
};

export type PdfRendererTools = CreateOverlayRedactionTool;
// TODO: uncomment when annotation creation tools is built
// | CreateOverlayAnnotationTool;

export enum zoomLevels {
  'auto' = 'auto',
  'pageActual' = 'page-actual',
  'pageFit' = 'page-fit',
  'pageWidth' = 'page-width',
}

export interface PDFRendererProps {
  children?: React.ReactNode;
  /**
   * The id of the document
   */
  documentId: number | string;
  /**
   * The url of the PDF file. Relative and absolute are accepted
   */
  documentUrl: string;
  /**
   * A Blob of the PDF file or a string pointing to a location of a PDF blob
   * such as would be returned by createObjectURL. When passed this will
   * override the fetch of the document
   */
  documentBlob?: Blob | string;
  /**
   * Called each time a new document is about to be fetched.
   */
  getCustomHeaders?: () => Promise<{ [key: string]: string }>;
  /**
   * The number of the first page to be rendered. The document will be positioned so that this page is the first page on screen
   */
  initialPageNumber: number;
  /**
   * When set, moves the document viewport to show this page number. Does not stop the user from scrolling that page out of view
   */
  forcedPageNumber: number | null;
  /**
   * A normalized object of text highlights keyed by id
   */
  overlays: { [id: string]: Overlay };
  /**
   * Passing an overlay.id or array of overlay.ids set focus on it/them and will scroll the first overlay into view.
   */
  forceSelectOverlayById?: BaseOverlay['id'] | BaseOverlay['id'][] | null;
  /**
   * An even callback called each time one of the viewer events fires
   */
  onEvent: OnEvent;
  /**
   * The rotation of all pages in the document
   */
  rotation: 0 | 90 | 180 | 270 | -90 | -180 | -270;
  /**
   * When passed, changes the currently selected PDFRenderer tool. Used to set
   * the creation tool for redactions and annotations. It's important to note
   * that it is not needed to set any other type of tool as those are set by the
   * renderer.
   */
  tool?: PdfRendererTools;
  /**
   * The zoom level of the document
   */
  zoom: zoomLevels | number;
}

export type PDFTronDocViewer =
  React.MutableRefObject<PDFTronCore.DocumentViewer | null>;

export type RendererHTMLWrapper = React.RefObject<HTMLDivElement>;

export interface SelectedOverlayPositionContext {
  selectedOverlays?: Overlay[];
  position?: {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
    x: number;
    y: number;
  };
}
