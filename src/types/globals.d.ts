import { Core } from '@pdftron/webviewer';

declare global {
  interface Window {
    Core: typeof Core;
    Annotations: typeof Core.Annotations;
  }
}
