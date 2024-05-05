import React from "react";

export default function FirstSection({
  formData,
  handleChange,
  primaryPurpose,
  plannedInvestments,
  investmentWindow,
}) {
  return (
    <div className="space-y-10 divide-y divide-gray-900/10 mt-12">
      {/* Your Goal */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Your goal
          </h2>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="purpose-trading"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Primary purpose of trading with us
                </label>
                <div className="mt-2">
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select your primary purpose</option>
                    {primaryPurpose.map((purpose, index) => (
                      <option value={purpose} key={index}>
                        {purpose}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="planned-investments"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Planned investments
                </label>
                <div className="mt-2">
                  <select
                    name="investments"
                    value={formData.investments}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select your planned investments</option>
                    {plannedInvestments.map((investment, index) => (
                      <option value={investment} key={index}>
                        {investment}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="investment-window"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Investment window
                </label>
                <div className="mt-2">
                  <select
                    name="investWindow"
                    value={formData.investWindow}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select your investment window</option>
                    {investmentWindow.map((investment, index) => (
                      <option value={investment} key={index}>
                        {investment}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Save
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Save & Next
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
}
