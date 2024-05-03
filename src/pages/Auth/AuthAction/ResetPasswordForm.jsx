import React, { Fragment, useEffect, useState } from "react";
import DotLoader from "../../../components/DotLoader";
import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
import logo from "../../../assets/logo.png";
import { Popover, Transition } from "@headlessui/react";
import { useAlert } from "../../../context/AlertContext";
import { customAlert } from "../../../utils/alertUtils";

const strongPolicyRequirements = [
  { name: "Minimum of 6 characters" },
  { name: "One uppercase letter" },
  { name: "One lowercase letter" },
  { name: "At least one number" },
  { name: "At least one special character (!@#$%^&*)" },
];

const requirements = [
  { name: "No spaces allowed" },
  { name: "Minimum of 6 characters" },
];

export default function ResetPasswordForm({
  state,
  dispatch,
  handleChangePassword,
  ACTIONS,
  isStrongPolicy,
}) {
  const { showAlert } = useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    if (state.error) {
      customAlert({
        showAlert,
        title: "Error",
        description: state.error,
        showConfirmButton: false,
        iconBgColor: "bg-red-50",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        icon: ExclamationCircleIcon,
        timer: 2000,
      });

      const clearErrorTimeout = setTimeout(() => {
        dispatch({ type: ACTIONS.SHOW_ERROR, error: "" });
      }, 3000);
      return () => clearTimeout(clearErrorTimeout);
    }
  }, [state.error, dispatch, ACTIONS]);

  return (
    <div className="grid min-h-full h-screen flex-1 place-items-center justify-center py-12 sm:px-6 bg-blue-50 lg:px-8 sm:bg-custom-pattern bg-cover bg-center">
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-blue-50 px-6 py-12 sm:shadow sm:rounded-lg sm:px-12">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
            <img
              className="mx-auto h-10 w-auto"
              src={logo}
              alt="Company Logo"
            />
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Set Password
            </h2>
            <p className="mt-2 text-sm text-gray-700 grid place-items-center text-center">
              Kindly enter your new password to activate your account and log
              in.
              <Popover className="relative">
                <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                  <span>
                    <QuestionMarkCircleIcon
                      className="h-5 w-5 text-indigo-600"
                      aria-hidden="true"
                    />
                  </span>
                  {/* <ChevronDownIcon className="h-5 w-5" aria-hidden="true" /> */}
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-min -translate-x-1/2 px-4">
                    <ul className="w-56 shrink rounded-xl bg-white p-3 text-sm font-medium leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5 text-left">
                      { isStrongPolicy ? (
                        strongPolicyRequirements.map((item) => (
                          <li
                            key={item.name}
                            className="block hover:text-indigo-600"
                          >
                            {item.name}
                          </li>
                        ))) : (
                      requirements.map((item) => (
                        <li
                          key={item.name}
                          className="block hover:text-indigo-600"
                        >
                          {item.name}
                        </li>
                      )))
                    }
                    </ul>
                  </Popover.Panel>
                </Transition>
              </Popover>
            </p>
          </div>

          <form
            className="space-y-4 text-left mt-6"
            action="#"
            method="POST"
            onSubmit={handleChangePassword}
          >
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                className="bg-white focus:bg-blue-50 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type={showPassword ? "text" : "password"}
                name="password"
                value={state.password}
                onChange={(e) =>
                  dispatch({
                    type: ACTIONS.PASSWORD_CHANGE,
                    field: "password",
                    value: e.target.value,
                  })
                }
                autoComplete="password"
                placeholder="New Password"
                required
              />
              <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                {showPassword ? (
                  <EyeIcon
                    className="h-4 w-4 text-indigo-300"
                    aria-hidden="true"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <EyeSlashIcon
                    className="h-4 w-4 text-gray-300"
                    aria-hidden="true"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
            </div>

            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                className="bg-white focus:bg-blue-50 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={state.confirmPassword}
                onChange={(e) =>
                  dispatch({
                    type: ACTIONS.PASSWORD_CHANGE,
                    field: "confirmPassword",
                    value: e.target.value,
                  })
                }
                autoComplete="confirm-password"
                placeholder="Confirm Password"
                required
              />
              <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                {showConfirmPassword ? (
                  <EyeIcon
                    className="h-4 w-4 text-indigo-300"
                    aria-hidden="true"
                    onClick={toggleConfirmPassword}
                  />
                ) : (
                  <EyeSlashIcon
                    className="h-4 w-4 text-gray-300"
                    aria-hidden="true"
                    onClick={toggleConfirmPassword}
                  />
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {state.loading ? (
                  <div className="flex w-full justify-center align-middle gap-2">
                    <span>Setting</span>
                    <DotLoader />
                  </div>
                ) : (
                  "  Set Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
