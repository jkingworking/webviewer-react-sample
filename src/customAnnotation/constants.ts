export enum PdfRendererEventTypes {
  beginRendering = 'beginRendering',
  documentDestroyed = 'documentDestroyed',
  documentLoaded = 'documentLoaded',
  documentLoadRequest = 'documentLoadRequest',
  finishedRendering = 'finishedRendering',
  overlayDisplayOrderSet = 'overlayDisplayOrderSet',
  // Overlay Legend events
  overlayLegendCreated = 'overlayLegendCreated',
  overlayLegendModified = 'overlayLegendModified',
  overlayLegendDeleted = 'overlayLegendDeleted',
  overlayLegendDrawn = 'overlayLegendDrawn',
  overlayLegendSelected = 'overlayLegendSelected',
  overlayLegendDeselected = 'overlayLegendDeselected',
  overlayLegendsBeginRendering = 'overlayLegendsBeginRendering',
  overlayLegendsRendered = 'overlayLegendsRendered',
  // Overlay Redaction events
  overlayRedactionCreated = 'overlayRedactionCreated',
  overlayRedactionModified = 'overlayRedactionModified',
  overlayRedactionDeleted = 'overlayRedactionDeleted',
  overlayRedactionDrawn = 'overlayRedactionDrawn',
  overlayRedactionSelected = 'overlayRedactionSelected',
  overlayRedactionDeselected = 'overlayRedactionDeselected',
  overlayRedactionEditClicked = 'overlayRedactionEditClicked',
  overlayRedactionsBeginRendering = 'overlayRedactionsBeginRendering',
  overlayRedactionsRendered = 'overlayRedactionsRendered',
  // Overlay Text Highlight events
  overlayTextHighlightDeselected = 'overlayTextHighlightDeselected',
  overlayTextHighlightSelected = 'overlayTextHighlightSelected',
  overlayTextHighlightsBeginRendering = 'overlayTextHighlightsBeginRendering',
  overlayTextHighlightsRendered = 'overlayTextHighlightsRendered',
  // Generic Overlay events
  overlayMouseEnter = 'overlayMouseEnter',
  overlayMouseLeave = 'overlayMouseLeave',

  loadingError = 'loadingError',
  loadingProgress = 'loadingProgress',
  pageNumberUpdated = 'pageNumberUpdated',
  pageRendered = 'pageRendered',
  pdfScrolledToPageNumber = 'pdfScrolledToPageNumber',
  rotationUpdated = 'rotationUpdated',
  toolUpdated = 'toolUpdated',
  zoomUpdated = 'zoomUpdated',
}
export const redactionOverlayActions = {
  edit: 'redactionOverlayActionsEdit',
  delete: 'redactionOverlayActionsDelete',
};
export const discoOverlayId = 'discoOverlayId';
export const discoOverlayGroupId = 'discoOverlayGroupId';
export const discoOverlayJumpGroup = 'discoOverlayJumpGroup';
export const defaultJumpGroup = 'default';
export const discoLegendFontSize = 'discoLegendFontSize';
export const discoRedactionFontSize = 'discoRedactionFontSizes';
export const discoOverlayType = 'discoOverlayType';
export const discoOverlayIsJumpable = 'discoOverlayIsJumpable';
export enum discoOverlayTypes {
  highlight = 'highlight',
  customOverlay = 'customOverlay',
  legendOverlay = 'legendOverlay',
  redactionOverlay = 'redactionOverlay',
}

// Used it make a pdf page display at the intended scale on the screen.
export const CSS_UNITS = 96.0 / 72.0;
export const MAX_AUTO_SCALE = 1.25;
export const PAGE_PADDING = {
  BOTTOM: 0,
  LEFT: 16,
  RIGHT: 16,
  TOP: 16,
};
export const SCROLLBAR_WIDTH = 20;
export enum DocumentSource {
  Blob = 'blob',
  Url = 'url',
}
export interface FontSizes {
  default: number;
  max: number;
  min: number;
  lineHeightMultiplier: number;
}

export const fontSizes: FontSizes = {
  default: 7.5,
  max: 7.5,
  min: 4.5,
  lineHeightMultiplier: 1.9,
};

export interface TextPadding {
  /**
   * @description horizontal should be the 'em' value of the padding based on the size of the text.
   * @example When horizontal === 1.0 the horizontal padding would be 7.5px when the font is full size and 4.5 when at its smallest size
   */
  horizontal: number;
  /**
   * @description vertical should be the 'em' value of the padding based on the size of the text.
   * @example When vertical === 1.0 the vertical padding would be 7.5px when the font is full size and 4.5 when at its smallest size
   */
  vertical: number;
}

export const textPadding: TextPadding = {
  horizontal: 0.25,
  vertical: 0.25,
};

export const defaultLegendSymbol = '*';
