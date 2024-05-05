import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatNumber } from "../../config/utils";
import { getUserTerm } from "../../config/terms";
import TermsModal from "../FixedTerm/Add";

export default function TermTable() {
  const userId = useSelector((state) => state.user.userId);
  const [terms, setTerms] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    setIsLoading(true);
    try {
      const result = await getUserTerm(userId);
      setTerms(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequest = (item) => {
    setSelected(item);
    setOpen(true);
  };

  return (
    <div className="-mx-4 mt-8 sm:-mx-0">
      <div className="sm:flex-auto text-left mb-8">
        <p className="mt-2 text-sm text-gray-700">
          A list of all the terms you have purchased
        </p>
      </div>
      <div className="mt-8 overflow-scroll">
        <div className="align-middle inline-block min-w-full">
          <div className="border-t border-gray-200">
            {terms === null || terms.length === 0 ? (
              <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4 mt-12">
                <h5 className="text-gray-400 text-base ">
                  NO FIXED TERMS TRANSACTIONS AVAILABLE.
                </h5>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "Bank Name",
                      "Term",
                      "Type",
                      "Principal $",
                      "Interest",
                      "Purchase Date",
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
                  {terms.map((term, index) => (
                    <tr key={index}>
                      <td className="truncate max-w-12 whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {term.bankName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {term.term}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                        {term.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${formatNumber(term.principalAmount)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {term.interestRate}%
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {term.date}
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleRequest(term)}
                        >
                          Deposit
                        </button>
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleRequest(term)}
                        >
                          Withdraw
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <TermsModal
            open={open}
            setOpen={setOpen}
            fixedTerm={selected}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
