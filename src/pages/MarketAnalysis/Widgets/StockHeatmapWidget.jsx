import React, { useEffect, useRef } from 'react';

function StockHeatmapWidget() {
    const widgetContainerRef = useRef();

    useEffect(() => {
      if (!widgetContainerRef.current) {
        return;
      }
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
        script.async = true;
        script.type = "text/javascript";
        script.innerHTML = JSON.stringify({
            "exchanges": [],
            "dataSource": "SPX500",
            "grouping": "sector",
            "blockSize": "market_cap_basic",
            "blockColor": "change",
            "locale": "en",
            "symbolUrl": "",
            "colorTheme": "light",
            "hasTopBar": true,
            "isDataSetEnabled": false,
            "isZoomEnabled": true,
            "hasSymbolTooltip": true,
            "width": "100%",
            "height": "100%",
          });
          //Append the script only if it doesn't exist
          const existingScript = widgetContainerRef.current.querySelector('script');
          if (!existingScript) {
            widgetContainerRef.current.appendChild(script);
          }
      
          // Cleanup function
          return () => {
            if (existingScript && widgetContainerRef.current) {
              widgetContainerRef.current.removeChild(existingScript); 
            }
          };
      },
      []
    );
  
    return (
      <div className="tradingview-widget-container h-100vh-important" ref={widgetContainerRef} >
        <div className="tradingview-widget-container__widget"></div>
      </div>
    );
}

export default StockHeatmapWidget;



