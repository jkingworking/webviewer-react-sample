import { discoOverlayId } from '../constants';
import { Overlay, PDFTronDocViewer } from '../../types';

export const removeOverlaysById = (
  id: Overlay['id'] | Overlay['id'][],
  docViewer: PDFTronDocViewer
): void => {
  if (!docViewer.current) {
    return;
  }
  const annotManager = docViewer.current.getAnnotationManager();
  if (!annotManager) {
    return;
  }

  const filterFunc = Array.isArray(id)
    ? annot => id.includes(annot.getCustomData(discoOverlayId))
    : annot => annot.getCustomData(discoOverlayId) === id;

  const annotationsList = annotManager
    .getAnnotationsList()
    .filter(filterFunc)
    .map(annotation => {
      annotation.NoDelete = false;
      annotation.ReadOnly = false;
      return annotation;
    });

  if (annotationsList.length) {
    annotManager.deleteAnnotations(annotationsList);
  }
};
