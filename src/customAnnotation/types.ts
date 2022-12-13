import { LegendOverlay, RedactionOverlay } from '../types';

export type OverlayOutput = LegendOverlayOutput | RedactionOverlayOutput;

export type LegendOverlayOutput = LegendOverlay & {
  fontSize?: number;
  padding?: {
    x: number;
    y: number;
  };
};

export type RedactionOverlayOutput = RedactionOverlay & {
  fontSize?: number;
  padding?: {
    x: number;
    y: number;
  };
  showingLegendSymbol?: boolean;
};
