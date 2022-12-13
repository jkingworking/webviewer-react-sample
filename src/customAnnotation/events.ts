import {
  LegendOverlayOutput,
  RedactionOverlayOutput,
} from './types';
import { PdfRendererEventTypes, DocumentSource } from './constants';
import { Overlay, PDFRendererProps } from '../types';

export interface BeginRendering {
  type: PdfRendererEventTypes.beginRendering;
}
export interface DocumentDestroyed {
  type: PdfRendererEventTypes.documentDestroyed;
  payload: {
    documentUrl: PDFRendererProps['documentUrl'];
    documentId: PDFRendererProps['documentId'];
  };
}
export interface DocumentLoaded {
  type: PdfRendererEventTypes.documentLoaded;
  payload: {
    documentUrl: PDFRendererProps['documentUrl'];
    documentId: PDFRendererProps['documentId'];
    isLinearized: boolean;
    documentSource: DocumentSource;
    pageCount: number;
  };
}
export interface DocumentLoadRequest {
  type: PdfRendererEventTypes.documentLoadRequest;
  payload: {
    documentUrl: PDFRendererProps['documentUrl'];
    documentId: PDFRendererProps['documentId'];
    documentSource: DocumentSource;
  };
}
export interface FinishedRendering {
  type: PdfRendererEventTypes.finishedRendering;
}
export interface OverlayLegendOverlayCreated {
  type: PdfRendererEventTypes.overlayLegendCreated;
  payload: LegendOverlayOutput;
}
export interface OverlayLegendOverlayModified {
  type: PdfRendererEventTypes.overlayLegendModified;
  meta: {
    overlayId: string;
    pageNumber: number;
  };
  payload: LegendOverlayOutput;
}
export interface OverlayLegendOverlayDeleted {
  type: PdfRendererEventTypes.overlayLegendDeleted;
  meta: {
    overlayId: string;
  };
}
export interface OverlayLegendOverlayDrawn {
  type: PdfRendererEventTypes.overlayLegendDrawn;
  meta: {
    overlayId: string;
  };
  payload: LegendOverlayOutput;
}
export interface OverlayLegendOverlaySelected {
  type: PdfRendererEventTypes.overlayLegendSelected;
  meta: {
    overlayIds: string[];
    pageNumbers: number[];
  };
  payload: {
    action: 'selected';
  };
}
export interface OverlayLegendOverlayDeselected {
  type: PdfRendererEventTypes.overlayLegendDeselected;
  meta: {
    overlayIds: string[];
    pageNumbers: number[];
  };
  payload: {
    action: 'deselected';
  };
}
export interface OverlayLegendsBeginRendering {
  type: PdfRendererEventTypes.overlayLegendsBeginRendering;
}
export interface OverlayLegendsRendered {
  type: PdfRendererEventTypes.overlayLegendsRendered;
  payload: { pageNumber: number; overlayIds: Overlay['id'][] };
}

export interface OverlayRedactionCreated {
  type: PdfRendererEventTypes.overlayRedactionCreated;
  payload: RedactionOverlayOutput;
}
export interface OverlayRedactionOverlayModified {
  type: PdfRendererEventTypes.overlayRedactionModified;
  payload: RedactionOverlayOutput;
  meta: {
    overlayId: string;
  };
}
export interface OverlayRedactionOverlayDeleted {
  type: PdfRendererEventTypes.overlayRedactionDeleted;
  meta: {
    pageNumber: number;
    overlayId: string;
  };
}
export interface OverlayRedactionOverlayDrawn {
  type: PdfRendererEventTypes.overlayRedactionDrawn;
  payload: RedactionOverlayOutput;
  meta: {
    overlayId: string;
  };
}
export interface OverlayRedactionOverlaySelected {
  type: PdfRendererEventTypes.overlayRedactionSelected;
  payload: {
    action: 'selected';
  };
  meta: {
    overlayIds: string[];
    pageNumbers: number[];
  };
}
export interface OverlayRedactionOverlayDeselected {
  type: PdfRendererEventTypes.overlayRedactionDeselected;
  payload: {
    action: 'deselected';
  };
  meta: {
    overlayIds: string[];
    pageNumbers: number[];
  };
}
export interface OverlayRedactionOverlayEditClicked {
  type: PdfRendererEventTypes.overlayRedactionEditClicked;
  payload: {
    isSelected: boolean;
  };
  meta: {
    overlayId: string;
  };
}
export interface OverlayRedactionsBeginRendering {
  type: PdfRendererEventTypes.overlayRedactionsBeginRendering;
}
export interface OverlayRedactionsRendered {
  type: PdfRendererEventTypes.overlayRedactionsRendered;
  payload: { pageNumber: number; overlayIds: Overlay['id'][] };
}
export interface OverlayTextHighlightDeselected {
  type: PdfRendererEventTypes.overlayTextHighlightDeselected;
  meta: {
    overlayIds: string[];
    pageNumbers: number[];
  };
  payload: {
    action: 'deselected';
  };
}
export interface OverlayTextHighlightSelected {
  type: PdfRendererEventTypes.overlayTextHighlightSelected;
  meta: {
    overlayIds: string[];
    pageNumbers: number[];
  };
  payload: {
    action: 'selected';
  };
}
export interface OverlayTextHighlightsBeginRendering {
  type: PdfRendererEventTypes.overlayTextHighlightsBeginRendering;
}
export interface OverlayTextHighlightsRendered {
  type: PdfRendererEventTypes.overlayTextHighlightsRendered;
  payload: { pageNumber: number; overlayIds: Overlay['id'][] };
}
export interface OverlayMouseEnter {
  type: PdfRendererEventTypes.overlayMouseEnter;
  payload: {
    pageNumber: number;
    overlayId: Overlay['id'];
    isEditable: boolean;
    isSelected: boolean;
  };
}
export interface OverlayMouseLeave {
  type: PdfRendererEventTypes.overlayMouseLeave;
  payload: {
    pageNumber: number;
    overlayId: Overlay['id'];
    isSelected: boolean;
  };
}

export interface LoadingError {
  type: PdfRendererEventTypes.loadingError;
  payload: { error: ErrorEvent };
}
export interface LoadingProgress {
  type: PdfRendererEventTypes.loadingProgress;
  payload: { progress: number };
}
export interface PageNumberUpdated {
  type: PdfRendererEventTypes.pageNumberUpdated;
  payload: { pageNumber: number };
}
export interface PageRendered {
  type: PdfRendererEventTypes.pageRendered;
  payload: { pageNumber: number };
}
export interface PdfScrolledToPageNumber {
  type: PdfRendererEventTypes.pdfScrolledToPageNumber;
  payload: { pageNumber: number };
}

export interface RotationUpdated {
  type: PdfRendererEventTypes.rotationUpdated;
  payload: {
    rotation: number;
  };
}
export interface ZoomUpdated {
  type: PdfRendererEventTypes.zoomUpdated;
  payload: {
    zoom: number;
  };
}

export interface ToolUpdated {
  type: PdfRendererEventTypes.toolUpdated;
  payload: {
    currentTool: string;
    previousTool: string;
  };
}

export type PDFRendererEvent =
  | BeginRendering
  | DocumentDestroyed
  | DocumentLoaded
  | DocumentLoadRequest
  | FinishedRendering
  | LoadingError
  | LoadingProgress
  | OverlayLegendOverlayDeselected
  | OverlayLegendOverlayCreated
  | OverlayLegendOverlayModified
  | OverlayLegendOverlayDeleted
  | OverlayLegendOverlayDrawn
  | OverlayLegendOverlaySelected
  | OverlayLegendsBeginRendering
  | OverlayLegendsRendered
  | OverlayRedactionOverlayDeleted
  | OverlayRedactionOverlayDrawn
  | OverlayRedactionOverlayDeselected
  | OverlayRedactionOverlayEditClicked
  | OverlayRedactionCreated
  | OverlayRedactionOverlayModified
  | OverlayRedactionOverlaySelected
  | OverlayRedactionsBeginRendering
  | OverlayRedactionsRendered
  | OverlayTextHighlightDeselected
  | OverlayTextHighlightsBeginRendering
  | OverlayTextHighlightSelected
  | OverlayTextHighlightsRendered
  | OverlayMouseEnter
  | OverlayMouseLeave
  | PageNumberUpdated
  | PageRendered
  | PdfScrolledToPageNumber
  | RotationUpdated
  | ToolUpdated
  | ZoomUpdated;

export interface PDFRendererEventMeta {
  meta: {
    documentId: string | number;
  };
}
export type PDFRendererEventWithDocumentIdMeta = PDFRendererEventMeta &
  PDFRendererEvent;
