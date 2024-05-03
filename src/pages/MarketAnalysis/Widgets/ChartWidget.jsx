import React, { useEffect, useRef } from "react";

let tvScriptLoadingPromise;

export default function ChartWidget({ symbol, setIsChartWidgetLoading }) {
  const chartContainerRef = useRef();
  const chartIdRef = useRef(
    `tradingview_chart_${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {

    if (!symbol) {
      return;
    }


    const createWidget = () => {
      if ("TradingView" in window) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: chartIdRef.current,
          height: "100%",
        });
      } else {
        console.error("TradingView widget failed to initialize");
      }
    };

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = () => {
          resolve();
        };
        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(createWidget);

    return () => {
      const container = document.getElementById(chartIdRef.current);
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [symbol]); 

  return (
    <div
      className="tradingview-widget-container h-100vh-important importantWidth"
    >
      
      <div
        id={chartIdRef.current}
        ref={chartContainerRef}
      />
    </div>
  );
}
