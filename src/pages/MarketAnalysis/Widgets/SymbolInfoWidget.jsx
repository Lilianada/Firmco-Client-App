import React, { useEffect, useRef, useState } from 'react';

const SymbolInfoWidget = ({ symbol }) => {
  const widgetRef = useRef(null);
  const scriptId = `symbol-info-script-${symbol}`;
  const [delayRenderStatus, setDelayRenderStatus] = useState(true);

  const handleShow = () => {
    try {
      if (!symbol || !widgetRef.current) return;
      if (document.getElementById(scriptId)) return;

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        "symbol": symbol,
        "width": "100%",
        "locale": "en",
        "colorTheme": "light",
        "isTransparent": false,
      });

      widgetRef.current.appendChild(script);

    } catch (error) {
      console.error("Error in loading widget script: ", error);
    }
  };

  useEffect(() => {
    // Function to handle the rendering of the widget
    handleShow();
    // Delay the widget render
    if (delayRenderStatus) {
      setTimeout(() => {
        setDelayRenderStatus(false);
        handleShow();
      }, 2000);
    }

    // Cleanup function to remove the script
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript && widgetRef.current) {
        widgetRef.current.removeChild(existingScript); // Make sure widgetRef.current exists here
      }
    };
  }, [symbol, delayRenderStatus]);

  return (
    <div>
      {!delayRenderStatus && (
        <div className="tradingview-widget-container" ref={widgetRef}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
      )}
    </div>
  );
};

export default SymbolInfoWidget;
