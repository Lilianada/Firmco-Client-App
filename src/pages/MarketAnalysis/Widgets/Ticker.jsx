import React, { useEffect, useRef } from 'react';

const TickerWidget = () => {
  const widgetContainerRef = useRef(null);

  useEffect(() => {
    if (!widgetContainerRef.current) {
      return;
    }

    // Define the script element
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      "symbols": [
        {
          "proName": "FOREXCOM:SPXUSD",
          "title": "S&P 500"
        },
        {
          "proName": "FOREXCOM:NSXUSD",
          "title": "US 100"
        },
        {
          "proName": "FX_IDC:EURUSD",
          "title": "EUR to USD"
        },
        {
          "proName": "BITSTAMP:BTCUSD",
          "title": "Bitcoin"
        },
        {
          "proName": "BITSTAMP:ETHUSD",
          "title": "Ethereum"
        }
      ],
      "colorTheme": "dark",
      "isTransparent": false,
      "showSymbolLogo": true,
      "locale": "en"
    });

       // Append the script only if it doesn't exist
       const existingScript = widgetContainerRef.current.querySelector('script');
       if (!existingScript) {
         widgetContainerRef.current.appendChild(script);
       }
       
       return () => {
        if (existingScript && widgetContainerRef.current) {
          widgetContainerRef.current.removeChild(existingScript); // Make sure widgetRef.current exists here
        }
      };
      

  }, []); 

  return (
    <div className="tradingview-widget-container" ref={widgetContainerRef}>
    <div  className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default TickerWidget;

