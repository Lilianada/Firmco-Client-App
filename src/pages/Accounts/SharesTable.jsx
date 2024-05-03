import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getStock } from "../../config/stocks";
import { formatNumber } from "../../config/utils";

// Mock transactions data for display purposes
const transactions = [
  {
    id: "T1001",
    company: "Company A",
    share: "Tech",
    commission: "+$4.370",
    price: "$2,000.00",
    quantity: "50",
    netAmount: "$10000",
  },
  {
    id: "T1002",
    company: "Company B",
    share: "Finance",
    commission: "+$24.315",
    price: "$1,050.00",
    quantity: "30",
    netAmount: "$4500",
  },
  {
    id: "T1003",
    company: "Company C",
    share: "Health",
    commission: "+$14.370",
    price: "$3,000.00",
    quantity: "20",
    netAmount: "$6000",
  },
];

export default function Table() {
  const userId = useSelector((state) => state.user.userId);
  const [stocks, serStocks] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      setIsLoading(true);
      const fetchedStocks = await getStock(userId);
      serStocks(fetchedStocks);
    } catch (error) {
      console.error("Error fetching Stocks:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="px-4 mt-12 max-w-[96vw] sm:max-w-[92vw] lg:max-w-[100vw]">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <p className="mt-2 text-sm text-gray-700">
            A table of all the stock shares that you own.
          </p>
        </div>
      </div>
      <div className="mt-8 overflow-scroll">
        <div className="align-middle inline-block min-w-full">
          <div className="border-t border-gray-200">
            {stocks === null ? (
              <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4 mt-12">
                <h5 className="text-gray-400 text-base ">
                  NO STOCKS TRANSACTIONS AVAILABLE.
                </h5>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      " SYM",
                      "Company",
                      "Type",
                      "Share",
                      "TP",
                      "MP",
                      "TA",
                      "Value",
                      "+/-(%)",
                      "Status",
                      "Date",
                    ].map((header, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-slate-50">
                  {stocks.map((stock, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {stock.symbol}
                      </td>
                      <td className="truncate max-w-12 whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {stock.companyName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {stock.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                        {stock.shares}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${formatNumber(stock.tradePrice)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${formatNumber(stock.marketPrice)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${formatNumber(stock.tradeAmount)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${formatNumber(stock.value)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {stock.profitLoss}%
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {stock.status}
                      </td>
                      <td className="truncate whitespace-nowrap px-3 py-4 text-sm text-gray-500 xl:table-cell">
                        {stock.tradeDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
