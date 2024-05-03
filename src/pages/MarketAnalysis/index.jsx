/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import React, { useState } from "react";
import TickerWidget from "./Widgets/Ticker";
import SearchBar from "./Widgets/SearchBar";
import MiniChartWidget from "./Widgets/MiniChartWidget";
import ChartWidget from "./Widgets/ChartWidget";
import StockHeatmapWidget from "./Widgets/StockHeatmapWidget";
import MarketMovers from "./Widgets/MarketMovers";
import TechnicalAnalysisWidget from "./Widgets/TechnicalAnalysis";

export default function MarketAnalysis() {
  const [selectedSymbol, setSelectedSymbol] = useState("NASDAQ:AAPL");
  const [isTechnicalAnalysisLoading, setIsTechnicalAnalysisLoading] =
    useState(false);
  const [isChartWidgetLoading, setIsChartWidgetLoading] = useState(false);

  const handleSearch = (query) => {
    setSelectedSymbol(`NASDAQ:${query.toUpperCase()}`);
  };

  return (
      <main>
        <header className="relative isolate">
          <TickerWidget />
        </header>

        <div className="mx-auto mt-4 ba">
          <div className="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="grid gap-6 bg-white -mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8  lg:col-span-2 lg:row-span-2 lg:row-end-2 pb-8 xl:pt-8 m-1">
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                <SearchBar onSearch={handleSearch} />
                <MiniChartWidget symbol={selectedSymbol} />
              </div>

              <ChartWidget
                symbol={selectedSymbol}
                setIsChartWidgetLoading={setIsChartWidgetLoading}
              />
              <StockHeatmapWidget />
            </div>

            <div className="lg:col-start-3 grid gap-6">
              <div className="bg-white">
                <MarketMovers />
              </div>
              <div className="bg-white">
                <TechnicalAnalysisWidget
                  symbol={selectedSymbol}
                  setIsTechnicalAnalysisLoading={setIsTechnicalAnalysisLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
