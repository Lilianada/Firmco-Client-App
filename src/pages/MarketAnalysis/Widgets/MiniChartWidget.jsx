import React, { useEffect, useRef, useState } from 'react';

const MiniChartWidget = ({ symbol }) => {
  const widgetRef = useRef(null);
  const scriptId = `mini-chart-script-${symbol}`;
  const [delayRenderStatus, setDelayRenderStatus] = useState(true);

  const handleShow = () => {
    try {
      if (!symbol || !widgetRef.current) return;
      if (document.getElementById(scriptId)) return;

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        "symbol": symbol,
        "width": "350",
        "height": "100",
        "locale": "en",
        "dateRange": "12M",
        "colorTheme": "light",
        "isTransparent": false,
        "autosize": false,
        "largeChartUrl": "",
        "chartOnly": false,
        "noTimeScale": true,
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
      if (existingScript) {
        existingScript.remove();
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

export default MiniChartWidget;
