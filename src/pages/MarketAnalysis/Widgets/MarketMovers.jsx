import React, { useEffect, useRef } from 'react';

const MarketMovers = () => {
  const widgetRef = useRef(null); // To reference the widget container

  useEffect(() => {
    if (!widgetRef.current) {
      return;
    }
    // Create the script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      "colorTheme": "light",
      "dateRange": "12M",
      "exchange": "US",
      "showChart": true,
      "locale": "en",
      "largeChartUrl": "",
      "isTransparent": false,
      "showSymbolLogo": false,
      "showFloatingTooltip": false,
      // "width": "100% !important",
      "height": "600",
      "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
      "plotLineColorFalling": "rgba(41, 98, 255, 1)",
      "gridLineColor": "rgba(240, 243, 250, 0)",
      "scaleFontColor": "rgba(106, 109, 120, 1)",
      "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
      "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
      "symbolActiveColor": "rgba(41, 98, 255, 0.12)"
    });

     // Append the script only if it doesn't exist
     const existingScript = widgetRef.current.querySelector('script');
     if (!existingScript) {
       widgetRef.current.appendChild(script);
     }
 
     // Cleanup function
     return () => {
      if (existingScript && widgetRef.current) {
        widgetRef.current.removeChild(existingScript); // Make sure widgetRef.current exists here
      }
    };
  }, []); // Empty dependency array ensures the effect only runs once on mount

  return (
    <div className="tradingview-widget-container">
      <div ref={widgetRef} className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default MarketMovers;
