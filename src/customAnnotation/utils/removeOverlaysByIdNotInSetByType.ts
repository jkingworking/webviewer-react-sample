import { discoOverlayId, discoOverlayType } from '../constants';
import { Overlay, PDFTronDocViewer } from '../../types';
import { removeOverlaysById } from './removeOverlaysById';

export const removeOverlaysByIdNotInSetByType = (
  ids: Overlay['id'][],
  type: Overlay['type'],
  docViewer: PDFTronDocViewer
): void => {
  if (!docViewer.current) {
    return;
  }
  const annotManager = docViewer.current.getAnnotationManager();
  if (!annotManager) {
    return;
  }

  const annotationsIdsList = annotManager
    .getAnnotationsList()
    .filter(annot => annot.getCustomData(discoOverlayType) === type)
    .map(annot => annot.getCustomData(discoOverlayId))
    .filter(annotId => !ids.includes(annotId));

  removeOverlaysById(annotationsIdsList, docViewer);
};
