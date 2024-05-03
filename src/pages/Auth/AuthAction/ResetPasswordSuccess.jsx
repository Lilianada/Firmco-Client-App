import React from 'react';
import logo from '../../../assets/logo.png';
import DotLoader from '../../../components/DotLoader';

export default function ResetPasswordSuccess({ state, navigate }) {
  return (
    <div
    className="grid min-h-full h-screen flex-1 place-items-center justify-center py-12 sm:px-6 bg-blue-50 lg:px-8 sm:bg-custom-pattern bg-cover bg-center"
  >
    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div className="bg-blue-50 px-6 py-12 sm:shadow sm:rounded-lg sm:px-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
          <img
            className="mx-auto h-10 w-auto"
            src={logo}
            alt="Company Logo"
          />
          <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Password Set!
          </h2>
          <p className="mt-2 text-sm text-gray-700 text-center">
          Password set successfully! You can now proceed to log in to your
            account. Click the "Login" button below to access your account.
          </p>
        </div>

        <form
          className="space-y-4 text-left mt-6"
          action="#"
          method="POST"
          onSubmit={() => navigate("/")}
        >

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {state.loading ? (
                <div className="flex w-full justify-center align-middle gap-2">
                  <span>Logging in</span>
                  <DotLoader />
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}
