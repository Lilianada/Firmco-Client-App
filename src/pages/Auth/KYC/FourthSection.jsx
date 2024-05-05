import React from 'react'

export default function FourthSection({ formData, handleChange}) {
  return (
    <div className="space-y-10 divide-y divide-gray-900/10 mt-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Leverage Investing Experience
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              The following questions relate to your leveraged investment
              experience (CFDS, futures, options, forex, margin trading, etc.)
              over the last year.
            </p>
          </div>

          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="leverageExperience"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    How many of these types of investments have you made?
                  </label>
                  <div className="mt-2">
                    {["1-10", "10-40", "40 plus"].map((investment, index) => (
                      <div key={index}>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="leverageExperience"
                            value={investment}
                            checked={formData.leverageExperience.includes(
                              investment
                            )}
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
                    htmlFor="leverageInvestments"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    In the last year, how much have you invested in ?
                  </label>
                  <div className="mt-2">
                    {["$1-$500", "$500-$2000", "$2000 plus"].map(
                      (investment, index) => (
                        <div key={index}>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="leverageInvestments"
                              value={investment}
                              checked={formData.leverageInvestments.includes(
                                investment
                              )}
                              onChange={handleChange}
                              className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {investment}
                            </span>
                          </label>
                        </div>
                      )
                    )}
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
