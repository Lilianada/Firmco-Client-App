import React, { useEffect, useState } from "react";
import { useModal } from "../../context/ModalContext";
import { useSelector } from "react-redux";
import { getBondsHoldings } from "../../config/bonds";
import DotLoader from "../../components/DotLoader";
import { formatNumber } from "../../config/utils";
import AddUserBonds from "../Bonds/Add";
import { set } from "date-fns";

export default function BondTable() {
  const userId = useSelector((state) => state.user.userId);
  const { showModal, hideModal } = useModal();
  const [bonds, setBonds] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBonds();
  }, []);

  const fetchBonds = async () => {
    setIsLoading(true);
    try {
      const result = await getBondsHoldings(userId);
      setBonds(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuy = (bond) => {
    setSelectedId(bond);
    setOpen(true);
  };

  const handleSell = (bond) => {
    setSelectedId(bond);
    setOpen(true);
  };

  return (
    <div className="px-4 mt-12 max-w-[96vw] sm:max-w-[92vw] lg:max-w-[100vw]">
      <div className="sm:flex-auto text-left mb-8">
      <p className="mt-2 text-sm text-gray-700">
          A list of all the bonds you have purchased.
        </p>
      </div>
      <div className="mt-8 overflow-scroll">
        <div className="align-middle inline-block min-w-full">
          <div className="border-t border-gray-200">
            {bonds === null || bonds.length === 0 ? (
              <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4 mt-12">
                <h5 className="text-gray-400 text-base ">
                  NO BONDS TRANSACTIONS AVAILABLE.
                </h5>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "Issuer",
                      "Value",
                      "Quantity",
                      "Type",
                      "Date Issued",
                      "Maturity Date",
                    ].map((header, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {header}
                      </th>
                    ))}
                    <th scope="col" className="relative px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <span className="sr-only">Buy</span>
                    </th>
                    <th scope="col" className="relative px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <span className="sr-only">Sell</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-slate-50">
                  {bonds.map((item, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap truncate max-w-12 px-3 py-4 text-sm text-gray-500">
                        {item.issuerName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                        ${formatNumber(item.currentValue)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 uppercase">
                        {item.typeOfRequest}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.purchaseDate || item.saleDate || item.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.maturityDate}
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          onClick={() => handleBuy(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Buy
                          <span className="sr-only">, {item.issuerName}</span>
                        </button>
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          onClick={() => handleSell(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Sell
                          <span className="sr-only">, {item.issuerName}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <AddUserBonds
              bond={selectedId}
              setBond={setSelectedId}
              open={open}
              setOpen={setOpen}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
