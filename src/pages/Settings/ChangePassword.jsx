import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import React, { Fragment, useEffect, useState } from "react";
import { fetchPasswordPolicySetting } from "../../config/utils";
import { Popover, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import DotLoader from "../../components/DotLoader";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { customModal } from "../../utils/modalUtils";
import { useModal } from "../../context/ModalContext";

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

export default function ChangePassword() {
  const { showModal } = useModal();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStrongPasswordPolicy, setIsStrongPasswordPolicy] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const validatePassword = (pass, isStrongPolicy) => {
    if (isStrongPolicy) {
      const regex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;
      return regex.test(pass);
    } else {
      return pass.length >= 6;
    }
  };

  const validatePasswords = () => {
    if (newPassword !== confirmPassword) {
      customModal({
        showModal,
        title: "Error",
        text: `New password and confirm password do not match.`,
        icon: ExclamationCircleIcon,
        showConfirmButton: false,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 1500,
      });
      return false;
    }
    if (!validatePassword(newPassword, isStrongPasswordPolicy)) {
      customModal({
        showModal,
        title: "Error",
        text: isStrongPasswordPolicy
          ? "Password must be at least 8 characters long, must contain at least one number and a special character."
          : "Password must be at least 6 digits long.",
        icon: ExclamationCircleIcon,
        showConfirmButton: false,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 1500,
      });
      return false;
    }
    return true;
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      customModal({
        showModal,
        title: "Error",
        text: `Passwords do not match.`,
        icon: ExclamationCircleIcon,
        showConfirmButton: false,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 1500,
      });
      return;
    }

    if (!validatePasswords()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    reauthenticateWithCredential(user, credential)
      .then(() => {
        // User re-authenticated.
        return updatePassword(user, newPassword);
      })
      .then(() => {
        customModal({
          showModal,
          title: "Success",
          text: `Password updated successfully.`,
          icon: CheckIcon,
          showConfirmButton: false,
          iconBgColor: "bg-green-100",
          iconTextColor: "text-green-600",
          buttonBgColor: "bg-green-600",
          timer: 1500,
        });
      })
      .catch((error) => {
        customModal({
          showModal,
          title: "Error",
          text: `Failed to update password. Please make sure your current password is correct.`,
          icon: ExclamationCircleIcon,
          showConfirmButton: false,
          iconBgColor: "bg-red-100",
          iconTextColor: "text-red-600",
          buttonBgColor: "bg-red-600",
          timer: 1500,
        });
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // Fetch the password policy setting from Firestore.
    fetchPasswordPolicySetting()
      .then((isStrong) => {
        setIsStrongPasswordPolicy(isStrong);
      })
      .catch((error) => {
        console.error("Error fetching password policy:", error);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <div className="text-base font-semibold leading-7 text-gray-900 flex gap-2">
          Change Password
          <Popover className="relative">
            <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              <span>
                <QuestionMarkCircleIcon
                  className="h-5 w-5 text-indigo-600"
                  aria-hidden="true"
                />
              </span>
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
                  {isStrongPasswordPolicy
                    ? strongPolicyRequirements.map((item) => (
                        <li
                          key={item.name}
                          className="block hover:text-indigo-600"
                        >
                          {item.name}
                        </li>
                      ))
                    : requirements.map((item) => (
                        <li
                          key={item.name}
                          className="block hover:text-indigo-600"
                        >
                          {item.name}
                        </li>
                      ))}
                </ul>
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Confirm your password and make sure it is something you can remember.
        </p>
      </div>

      <form
        className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
        onSubmit={handleChangePassword}
      >
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="current-password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Current password
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                  {showPassword ? (
                    <EyeIcon
                      className="h-5 w-5 text-indigo-400"
                      aria-hidden="true"
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <EyeSlashIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                New password
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                  {showNewPassword ? (
                    <EyeIcon
                      className="h-5 w-5 text-indigo-400"
                      aria-hidden="true"
                      onClick={toggleNewPasswordVisibility}
                    />
                  ) : (
                    <EyeSlashIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                      onClick={toggleNewPasswordVisibility}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm password
              </label>
              <div className="mt-2">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isLoading ? (
              <div className="flex w-full justify-center align-middle gap-2">
                <span>Saving</span>
                <DotLoader />
              </div>
            ) : (
              "Update Password "
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
