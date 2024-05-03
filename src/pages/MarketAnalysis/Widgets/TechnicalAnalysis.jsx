import React, { useEffect, useRef, useState } from 'react';

const TechnicalAnalysisWidget = ({ symbol }) => {
  const widgetRef = useRef(null);
  const scriptId = `technical-analysis-script-${symbol}`;
  const [delayRenderStatus, setDelayRenderStatus] = useState(true);

  const handleShow = () => {
    try {
      if (!symbol || !widgetRef.current) return;
      if (document.getElementById(scriptId)) return;

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        "interval": "1m",
        "width": 425,
        "isTransparent": false,
        "height": 450,
        "symbol": symbol,
        "showIntervalTabs": true,
        "displayMode": "single",
        "locale": "en",
        "colorTheme": "light",
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
        <div className="tradingview-widget-container importantWidth" ref={widgetRef}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
      )}
    </div>
  );
};

export default TechnicalAnalysisWidget;
