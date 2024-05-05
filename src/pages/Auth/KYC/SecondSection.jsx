import React from 'react'

export default function SecondSection({
    formData,
    handleChange,
    stockExperiences,
    stockInvestents,
}) {
  return (
    <div className="space-y-10 divide-y divide-gray-900/10 mt-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Stocks Investing Experience
            </h2>
          </div>

          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="purpsoe-trading"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Over the last year, how many times have you invested in
                    stocks and/or ETFs?
                  </label>
                  <div className="mt-2">
                    {stockExperiences.map((investment, index) => (
                      <div key={index}>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="stockExperience"
                            value={investment}
                            checked={formData.stockExperience === investment}
                            onChange={handleChange}
                            className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {investment}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="planned-investments"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    In the last year, how much have you invested in stocks
                    and/or ETFs?
                  </label>
                  <div className="mt-2">
                    {stockInvestents.map((investment, index) => (
                      <div key={index}>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="stocksInvestment"
                            value={investment}
                            checked={
                              formData.stocksInvestment.includes(investment) ||
                              false
                            }
                            onChange={handleChange}
                            className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {investment}
                          </span>
                        </label>
                      </div>
                    ))}
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
  )
}
