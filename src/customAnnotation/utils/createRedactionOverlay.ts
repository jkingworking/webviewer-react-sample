import {
  defaultJumpGroup,
  discoOverlayGroupId,
  discoOverlayId,
  discoOverlayIsJumpable,
  discoOverlayJumpGroup,
  discoOverlayType,
  discoOverlayTypes,
} from '../constants';
import {
  PDFTronDocViewer,
  RedactionOverlay as RedactionOverlayType,
} from '../../types';
import { defaultLegendSymbol } from '../constants';
import { RedactionOverlayFactory, RedactionOverlayI } from '../redactionOverlay';
import { colorToRgb } from './color-to-rgb';
import { rotatedCoordinatesForPdfTron } from './rotatedCoordinatesForPdfTron';


export const setRedactionOverlay = (
  docViewer: PDFTronDocViewer,
  annotation: RedactionOverlayI,
  overlay: RedactionOverlayType
): RedactionOverlayI => {
  const { Annotations } = window;
  const doc = docViewer.current.getDocument();
  const pageRotation = doc.getPageRotation(overlay.pageNumber) || 0;
  const pageInfo = doc.getPageInfo(overlay.pageNumber);

  annotation.Rotation = pageRotation;

  if (!overlay.isEditable) {
    annotation.ReadOnly = true;
    annotation.NoDelete = true;
  }
  annotation.BorderRadius = overlay.style.borderRadius || 0;
  annotation.StrokeColor = new Annotations.Color(
    ...colorToRgb(overlay.style.strokeColor)
  );
  annotation.isVisible = () => overlay.visible ?? true;
  annotation.FillColor = new Annotations.Color(
    ...colorToRgb(overlay.style.backgroundColor)
  );
  annotation.TextColor = new Annotations.Color(
    ...colorToRgb(overlay.textColor)
  );
  annotation.setPageNumber(overlay.pageNumber);
  annotation.fullPage = overlay.isFullPage;
  let x;
  let y;
  let width;
  let height;

  if (overlay.isFullPage) {
    width = docViewer.current.getPageWidth(overlay.pageNumber) || 0;
    height = docViewer.current.getPageHeight(overlay.pageNumber) || 0;
    x = 0;
    y = 0;
  } else {
    const rotatedCoords = rotatedCoordinatesForPdfTron(
      overlay.x,
      overlay.y,
      overlay.height,
      overlay.width,
      pageRotation,
      pageInfo
    );
    x = rotatedCoords.x;
    y = rotatedCoords.y;
    height = rotatedCoords.height;
    width = rotatedCoords.width;
  }

  annotation.setX(x);
  annotation.setY(y);
  annotation.setWidth(width);
  annotation.setHeight(height);

  annotation.setCustomData(
    discoOverlayType,
    discoOverlayTypes.redactionOverlay
  );
  annotation.setCustomData(discoOverlayId, overlay.id);
  annotation.setCustomData(discoOverlayGroupId, overlay.groupId ?? overlay.id);
  annotation.setCustomData(
    discoOverlayJumpGroup,
    overlay.jumpGroup ?? defaultJumpGroup
  );
  annotation.setCustomData(
    discoOverlayIsJumpable,
    JSON.stringify(overlay.jumpable ?? false)
  );
  annotation.setContents(overlay.textContent);
  annotation.ShowingLegendSymbol = !!overlay.legendSymbol;
  annotation.legendSymbol = overlay.legendSymbol || defaultLegendSymbol;

  return annotation;
};

export const createRedactionOverlay = (
  docViewer: PDFTronDocViewer,
  overlay: RedactionOverlayType
): RedactionOverlayI => {
  const RedactionOverlay = RedactionOverlayFactory();
  const redaction = new RedactionOverlay(docViewer);

  // @ts-ignore
  return setRedactionOverlay(docViewer, redaction, overlay);
};
