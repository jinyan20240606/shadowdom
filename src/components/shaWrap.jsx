/* eslint-disable react/prop-types */
import {  useEffect, useRef } from "react";
import * as ReactDOM from "react-dom";
import logJs from './log';
// import logJs2 from './log2';

const pvSrcript = logJs;

// const adDataCache = {};
const ShadowView = ({ children, htmlContent }) => {
  const hostRef = useRef(null);
  const shadowRootRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (hostRef.current && !shadowRootRef.current) {
      shadowRootRef.current = hostRef.current.attachShadow({ mode: "open" });
      const shadowRoot = hostRef.current.shadowRoot;
      console.log(shadowRoot, shadowRootRef.current, '19---', hostRef.current)

      // 创建一个新的script元素
      const scriptElement = document.createElement("script");
      // scriptElement.src = './src/components/log.js';
      scriptElement.innerHTML = 'console.log(1);'+pvSrcript;
      shadowRoot.appendChild(scriptElement);

      // 将shadowRoot挂载到全局变量中
      window.ad_document = shadowRoot;
    }
  }, []);

  const adWrapperID = `ad_wrapper_111`;
  useEffect(() => {
    if (hostRef.current && shadowRootRef.current && htmlContent) {
      setTimeout(() => {
        const scriptHtml = `<script>console.log('!this a script!');</script>`;

      // 获取 Shadow DOM 的根元素
      // const shadowRoot = hostRef.current.shadowRoot;

      // // 分离 HTML 内容中的脚本部分
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent + scriptHtml, "text/html");

      // 执行内联脚本
      const scripts = doc.querySelectorAll("script");
      console.log("scripts", scripts);
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        newScript.textContent = script.textContent;
        shadowRootRef.current.appendChild(newScript);
      });

      // // 外部document中的body
      // window.ad_document.body = shadowRoot.ownerDocument.body;
      // window.ad_document.documentElement = shadowRoot.ownerDocument.documentElement;
      }, 1000)
      
    }
  }, [htmlContent]);

  return (
    <div className="57" ref={hostRef}>
      {shadowRootRef.current && (
        <>
          {ReactDOM.createPortal(
            <div ref={containerRef} id={adWrapperID}>
              {children}
            </div>,
            shadowRootRef.current
          )}
        </>
      )}
    </div>
  );
};

export default ShadowView;
