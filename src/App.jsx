import "./App.css";
import ShadowView from "./components/shaWrap";
import { useState, useEffect, useRef } from "react";
import adData from "./components/adData";
import "./components/_loader111";

function App() {
  const [htmlAd, setHtmlAd] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    // 插入广告内容
    setHtmlAd(`<style>.im-color{color:red}</style><span class="im-color">1111</span>`);
  }, []);

  const padding =
    htmlAd?.filter?.((item) => item?.count > 0)?.length > 0
      ? ""
      : "pt-1px pb-1px";

  return (
    <div id="ad-container">
      <span className="im-color">这是广告容器</span>
      <ShadowView
        htmlContent={htmlAd}
        // styleContent={`*{color:red;}`}
      >
        {/* <style>{`*{color:red;}`}</style> */}
        <div
          className="29"
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: htmlAd }}
        >
        </div>
      </ShadowView>
    </div>
  );
}

export default App;
