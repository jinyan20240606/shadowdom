import "./App.css";
// import Iframe from "./components/iframe";
import Header from "./components/Header";
import { useState, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import HTMLCode from "./components/htmlCode";
import Frame from 'react-frame-component';

function App() {
  const [htmlAd, setHtmlAd] = useState("");
  // const containerRef = useRef(null);

  useLayoutEffect(() => {
    // 插入广告内容
    setHtmlAd(HTMLCode);
    setContentDocument(HTMLCode);
  }, []);

  const setContentDocument = (code) => {
     const iframe = document.getElementById("my-iframe");
    if (iframe && iframe.contentDocument) {
      iframe.contentDocument.open();
      iframe.contentDocument.write(code);
      iframe.contentDocument.close();
    }
  }
  const iframe1 = document.getElementById("my-iframe1");
  const iframeBody = iframe1?.contentWindow?.document?.body;

  return (
    <div id="ad-container">
      <Header></Header>
      <h2 className="im-color">这是iframe容器</h2>
      <div>
        <p>srcDoc方式</p>
        <iframe srcDoc={htmlAd}></iframe>
        {/* <p>contentDocument方式</p>
        <iframe id="my-iframe"></iframe> */}
        {/* <p>react-createPortal方式</p>
        <iframe id="my-iframe1"></iframe> */}
        {/* 正常的组件内容 */}
      {/* {iframeBody && ReactDOM.createPortal(
        <div>
          <Header></Header>
        <div dangerouslySetInnerHTML={{ __html: htmlAd }}></div>
        </div>,
        iframeBody
      )}
      <p>react-frame-component方式</p>
      <Frame>
      <Header></Header>
        <div dangerouslySetInnerHTML={{ __html: htmlAd }}></div>
      </Frame> */}
      </div>

      <button
        onClick={() => {
          console.log("iframe-重新加载src");
          setHtmlAd((str) => str + new Date().getTime());
          setContentDocument(htmlAd + new Date().getTime());
        }}
      >
        刷新iframe
      </button>
    </div>
  );
}

export default App;
