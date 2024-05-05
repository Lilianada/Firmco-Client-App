import React, { useEffect, useState } from "react";
import { getUserIpos } from "../../config/ipos";
import { useSelector } from "react-redux";
import { formatNumber } from "../../config/utils";
import AddIpos from "../Ipos/Add";

export default function IPOsTable() {
  const userId = useSelector((state) => state.user.userId);
  const [ipos, setIpos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetchIpos();
  }, []);

  const fetchIpos = async () => {
    try {
      const result = await getUserIpos(userId);
      setIpos(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInvest = (item) => {
    setSelected(item);
    setOpen(true)
  };

  return (
    <div className="px-4 mt-12 max-w-[96vw] sm:max-w-[92vw] lg:max-w-[100vw]">
      <div className="sm:flex-auto text-left mb-8">
        <p className="mt-2 text-sm text-gray-700">
          A list of all the IPOs you have purchased
        </p>
      </div>
      <div className="mt-8 overflow-scroll">
        <div className="align-middle inline-block min-w-full">
          <div className="border-t border-gray-200">
            {ipos === null ? (
              <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4 mt-12">
                <h5 className="text-gray-400 text-base ">
                  NO IPOS TRANSACTIONS AVAILABLE.
                </h5>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "Company Name",
                      "Type",
                      "Shares",
                      "Price",
                      "Total",
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
                    <th
                      scope="col"
                      className="relative px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <span className="sr-only">Invest</span>
                    </th>
                    <th
                      scope="col"
                      className="relative px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <span className="sr-only">Sell</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-slate-50">
                  {ipos.map((item, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap truncate max-w-12 px-3 py-4 text-sm text-gray-500 lg:table-cell">
                        {item.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.numberOfShares}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${formatNumber(item.sharePrice)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${formatNumber(item.numberOfShares * item.sharePrice)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.date}
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          onClick={() => handleInvest(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Invest<span className="sr-only">, {item.name}</span>
                        </button>
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          onClick={() => handleInvest(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Sell
                          <span className="sr-only">, {item.name}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <AddIpos
            ipo={selected}
            setOpen={setOpen}
            open={open}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
