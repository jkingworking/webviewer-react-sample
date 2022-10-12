import React, { useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  .viewer-outer-wrapper {
    display: flex;
    height: 100vh;
    width: 100vw;
    left: 0;
    position: fixed;
    top: 0;
  }

  .viewer2__sidebar {
    background-color: rgb(1, 41, 57);
    height: 100vh;
    position: relative;
    flex: 0 0 auto;
    width: 300px;
  }

  .viewer-center-renderer-panel {
    display: flex;
    flex: 1 1 auto;
    overflow: hidden;
  }

  .viewer-renderer-outer-wrapper {
    background-color: #cad1d4;
    display: flex;
    flex-direction: column;
    flex: 0 1 100%;
  }

  .renderer-header {
    background-color: #33515e;
    flex: 0 0 auto;
    min-height: 35px;
  }

  .viewer2__meta-sidebar {
    background: rgb(1, 41, 57);
    border-left: 1px solid transparent;
    display: flex;
    flex-direction: column;
    position: relative;
    right: 0;
    min-width: 300px;
  }

  .renderer_wrapper {
    height: 100%;
    width: 100%;
    min-height: 0;
  }
`;

const PDFViewerWrapper = styled.div`
  height: 100%;
  overflow: auto;
`;

const PDFRenderer = styled.div`
  height: 100%;
  margin: 10px auto auto auto;
`;

const scriptPath = `/webviewer/lib/core/`;

const App = () => {
  const viewerRef = useRef(null);
  const viewerWrapperRef = useRef(null);
  const docViewer = React.useRef(null);
  const documentUrl = 'https://vendor-pdf-demo-files.s3.us-west-2.amazonaws.com/LargeDocs/30000-nearnative.pdf';

  React.useEffect(() => {
    const scriptTag = document.querySelector('script[data-pdftron]');
    if (!scriptTag) {
      const scriptElem = document.createElement('script');
      scriptElem.type = 'text/javascript';
      scriptElem.async = true;
      scriptElem.src = `${scriptPath}webviewer-core.min.js`;
      scriptElem.dataset.pdftron = 'viewer-platform-ui';
      document.head.appendChild(scriptElem);
    }
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      window.Core.setWorkerPath(scriptPath);
      window.Core.setResourcesPath(scriptPath);
      docViewer.current = new window.Core.DocumentViewer();
      viewerWrapperRef.current &&
      docViewer.current.setScrollViewElement(viewerWrapperRef.current);
      viewerRef.current &&
      docViewer.current.setViewerElement(viewerRef.current);
      docViewer.current.enableAnnotations();
      docViewer.current.loadDocument(documentUrl, {
        extension: 'pdf',
        docId: documentUrl
      });
      docViewer.current.setToolMode(docViewer.current.getTool('TextSelect'));
    }, 1000);
  }, []);

  return (
    <Wrapper>
      <div className="viewer-outer-wrapper">
        <aside className="viewer2__sidebar"/>
        <div className="viewer-center-renderer-panel">
          <section className="viewer-renderer-outer-wrapper ">
            <div className="renderer-header"/>
            <div className="renderer_wrapper">
              <PDFViewerWrapper ref={viewerWrapperRef}>
                <PDFRenderer ref={viewerRef}></PDFRenderer>
              </PDFViewerWrapper>
            </div>
          </section>
          <section className="viewer2__meta-sidebar "/>
        </div>
      </div>
    </Wrapper>
  );
};

export default App;
