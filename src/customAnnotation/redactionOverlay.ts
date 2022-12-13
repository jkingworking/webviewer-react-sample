import { Core as PDFTronCore } from '@pdftron/webviewer';
import { closeIcon } from './svgIcons/closeIcon';
import { pencilIcon } from './svgIcons/pencilIcon';
import {
  discoOverlayGroupId,
  discoOverlayId,
  discoOverlayIsJumpable,
  discoOverlayJumpGroup,
  discoRedactionFontSize,
  redactionOverlayActions,
} from './constants';
import { ContentOverlay, PDFTronDocViewer } from '../types';
import { fontSizes, textPadding } from './constants';
import { RedactionOverlayOutput } from './types';
import { calculateFontSize } from './utils/calculateFontSize';
import { calculateMinTextHeight } from './utils/calculateMinTextHeight';
import { calculateMinTextWidth } from './utils/calculateMinTextWidth';
import { calculatePadding } from './utils/calculatePadding';
import { drawRotatedOverlay } from './utils/drawRotatedOverlay';
import { drawRoundRect } from './utils/drawRoundRect';
import { ptToPx } from './utils/ptToPx';
import { renderSvgToCanvas } from './utils/renderSvgToCanvas';
import { restoreRotatedCoordinates } from './utils/rotatedCoordinatesForPdfTron';

export interface RedactionAction {
  id: string;
  title: string;
  icon: string;
}

export interface RedactionOverlayI
  extends PDFTronCore.Annotations.CustomAnnotation,
    ContentOverlay {
  actions: RedactionAction[];
  actionIconRegion: () => {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  BorderRadius: number;
  docViewer: PDFTronDocViewer;
  fullPage: boolean;
  FontSize: number;
  iconSize: number;
  legendSymbol: string;
  padding: { x: number; y: number };
  ShowingLegendSymbol: boolean;
  TextColor: PDFTronCore.Annotations.Color;
  getUnrotatedDimensions: () => {
    height: number;
    width: number;
    x: number;
    y: number;
  };
}

const truncateText = (
  context: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  availableWidth: number,
  lineEnd: string
) => {
  context.font = `${fontSize}pt Helvetica`;
  if (context.measureText(text).width <= availableWidth) {
    return text;
  }

  const endString = text.split('');
  while (
    endString.length &&
    context.measureText(endString.join('') + lineEnd).width > availableWidth
  ) {
    endString.pop();
  }
  return endString.join('') + lineEnd;
};

const ellipsisChar = '…';
const minDisplayTextWidth = 10;

export const RedactionOverlayFactory = () => {
  class RedactionOverlay extends window.Core.Annotations.CustomAnnotation {
    actions: RedactionAction[];
    BorderRadius: number;
    docViewer: PDFTronDocViewer;
    fullPage: boolean;
    FontSize: number;
    iconSize: number;
    legendSymbol: string;
    padding: { x: number; y: number };
    ShowingLegendSymbol: boolean;
    TextColor: PDFTronCore.Annotations.Color;

    constructor(docViewer) {
      super('disco-redaction');
      this.Subject = 'DiscoRedaction';
      this.docViewer = docViewer;
      this.BorderRadius = 0;
      this.fullPage = false;
      this.ShowingLegendSymbol = false;
      this.FontSize = fontSizes.max;
      this.padding = {x: 0, y: 0};
      this.TextColor = new window.Core.Annotations.Color(0, 0, 0)
      this.legendSymbol = '*';
      this.actions = [
        {id: redactionOverlayActions.edit, title: 'Edit', icon: pencilIcon},
        {id: redactionOverlayActions.delete, title: 'Delete', icon: closeIcon},
      ];
      this.iconSize = ptToPx(fontSizes.max);
    }

    isSelected(): boolean {
      const selectedAnnotations =
        this.docViewer.current.getAnnotationManager().getSelectedAnnotations() ||
        [];
      return selectedAnnotations
        .map(annotation => annotation.getCustomData(discoOverlayId))
        .includes(this.getCustomData(discoOverlayId));
    }

    isEditable(): boolean {
      return !this.ReadOnly;
    }

    isLegendSymbolShowing(context: CanvasRenderingContext2D): boolean {
      // @ts-ignore
      const {width, height} = this.getUnrotatedDimensions();

      const redactionText = this.getContents() || '';
      const [ , initialRightPadding, , initialLeftPadding ] = calculatePadding(
        textPadding,
        fontSizes.max
      );

      const availableTextWidth = width - initialRightPadding - initialLeftPadding;

      const minTextWidth = calculateMinTextWidth(
        context,
        redactionText,
        fontSizes.max,
        false
      );

      const minTextHeight = calculateMinTextHeight(
        context,
        redactionText,
        availableTextWidth,
        fontSizes.max,
        fontSizes.lineHeightMultiplier,
        textPadding,
        false
      );

      this.ShowingLegendSymbol =
        availableTextWidth < minTextWidth || height < minTextHeight;

      return this.ShowingLegendSymbol;
    }

    getPaddedIconSize() {
      return this.iconSize + this.padding.x * 2;
    }

    getActionIconAreaWidth(): [
      totalActionAreaWidth: number,
      showingActions: RedactionAction[],
      actionWidth: number
    ] {
      if (!this.isEditable()) {
        return [ 0, [], 0 ];
      }
      // @ts-ignore
      const {width} = this.getUnrotatedDimensions();

      const paddedIconSize = this.getPaddedIconSize();
      const padding = calculatePadding(textPadding, this.FontSize);

      const maxActionIconAreaWidth =
        this.actions.length * paddedIconSize + this.padding.x;

      const availibleActionIconAreaWidth =
        width - minDisplayTextWidth - padding[3];

      if (availibleActionIconAreaWidth >= maxActionIconAreaWidth) {
        return [ maxActionIconAreaWidth, this.actions, paddedIconSize ];
      }

      // Show only the icons that fit in the redaction
      const numberOfActionsToShow = Math.max(
        Math.floor(availibleActionIconAreaWidth / paddedIconSize),
        0
      );

      // Don't allow negative widths
      const actionsShowing = [ ...this.actions ].slice(0, numberOfActionsToShow);
      return [
        Math.max(numberOfActionsToShow * paddedIconSize, 0),
        actionsShowing,
        paddedIconSize,
      ];
    }

    drawActionIcons(context: CanvasRenderingContext2D): void {
      // Prevents moving / resizing full page redactions
      if (this.fullPage) {
        this.NoResize = true;
        this.NoMove = true;
      }
      // @ts-ignore
      const {width} = this.getUnrotatedDimensions();
      // Only render icons when the overlay is tall enough to fully show the icons
      if (!this.isEditable() || this.FontSize !== fontSizes.max) {
        return;
      }

      const [ topPadding, rightPadding ] = calculatePadding(
        textPadding,
        this.FontSize
      );

      // How much room is left for action icons?
      const [ , actionIcons ] = this.getActionIconAreaWidth();

      [ ...actionIcons ].reverse().forEach(({icon}, index) => {
        const i = index + 1;
        // Renders action icons
        renderSvgToCanvas(
          context,
          icon,
          width - i * this.iconSize - i * rightPadding * 2,
          topPadding,
          this.iconSize,
          this.iconSize,
          this.TextColor.toString()
        );
      });
    }

    draw(context: CanvasRenderingContext2D, pageMatrix: unknown): void {
      // Verify rotation of page and correct on mismatch.
      // Mismatches happen commonly when drawing a new redaction
      const pageRotation = this.docViewer.current
        .getDocument()
        .getPageRotation(this.PageNumber);
      if (pageRotation !== undefined && pageRotation !== this.Rotation) {
        this.Rotation = pageRotation;
      }

      // the setStyles function is a function on markup annotations that sets up
      // certain properties for us on the canvas for the annotation's stroke thickness.
      this.setStyles(context, pageMatrix);

      // @ts-ignore
      const {x, y, width, height} = this.getUnrotatedDimensions();
      drawRotatedOverlay(context, {
        x,
        y,
        width,
        height,
        rotation: this.Rotation,
      });

      // Translating the annotation's x/y coordinates to drawn in the correct location
      context.translate(x, y);

      // Calculate the next text layout
      const redactionText = this.getContents() || '';
      const legendSymbolShowing = this.isLegendSymbolShowing(context);
      const redactionDisplayText = legendSymbolShowing
        ? this.legendSymbol
        : redactionText;

      // Find fontsize
      this.FontSize = legendSymbolShowing
        ? calculateFontSize(
          context,
          redactionDisplayText,
          width,
          height,
          fontSizes.max,
          3,
          fontSizes.lineHeightMultiplier,
          textPadding
        )
        : fontSizes.max;
      this.setCustomData(discoRedactionFontSize, `${this.FontSize}pt`);

      const [ topPadding, , , leftPadding ] = calculatePadding(
        textPadding,
        this.FontSize
      );
      this.padding = {x: leftPadding, y: topPadding};

      const [ actionAreaWidth ] = this.getActionIconAreaWidth();
      const textLine = legendSymbolShowing
        ? redactionDisplayText
        : truncateText(
          context,
          redactionDisplayText,
          this.FontSize,
          width - actionAreaWidth,
          ellipsisChar
        );

      // Draw the redaction region
      drawRoundRect(context, 0, 0, width, height, this.BorderRadius);

      // Creates content clipping region
      context.beginPath();
      context.rect(0, 0, width, height);
      context.clip();

      this.drawActionIcons(context);

      // Add the redaction text
      context.textBaseline = 'top';
      context.textAlign = 'start';
      context.font = `${this.FontSize}pt Helvetica`;
      context.fillStyle = this.TextColor.toString();
      context.fillText(textLine, leftPadding, topPadding);
      context.closePath();
    }

    getOutputData() {
      const pageInfo = this.docViewer.current
        .getDocument()
        .getPageInfo(this.PageNumber) || {width: 0, height: 0};
      const {x, y, height, width} = restoreRotatedCoordinates(
        this.X,
        this.Y,
        this.Height,
        this.Width,
        this.Rotation,
        pageInfo
      );

      const redactionOverlay: RedactionOverlayOutput = {
        type: 'redactionOverlay',
        id: this.getCustomData(discoOverlayId),
        groupId: this.getCustomData(discoOverlayGroupId),
        pageNumber: this.getPageNumber(),
        jumpable: this.getCustomData(discoOverlayIsJumpable) === 'true',
        jumpGroup: this.getCustomData(discoOverlayJumpGroup),
        visible: this.isVisible(),
        textColor: this.TextColor.toString(),
        textContent: this.getContents(),
        style: {
          borderRadius: this.BorderRadius,
          strokeColor: this.StrokeColor.toString(),
          backgroundColor: this.FillColor.toString(),
        },
        isFullPage: this.fullPage,
        height,
        width,
        x,
        y,
        legendSymbol: this.ShowingLegendSymbol ? this.legendSymbol : '',
        showingLegendSymbol: this.ShowingLegendSymbol,
        padding: this.padding,
        fontSize: this.FontSize,
        isEditable: this.isEditable(),
      };
      return redactionOverlay;
    }
  }

  Object.assign(
    RedactionOverlay.prototype,
    // @ts-ignore this type exists but TS doesn't understand
    window.Core.Annotations.RotationUtils.RectangularCustomAnnotationRotationMixin
  );

  // this is necessary to set the elementName before instantiation
  RedactionOverlay.prototype.elementName = 'disco-redaction';

  return RedactionOverlay;
}

