import React, { useEffect, useState } from "react";
import {
  getBankingDetails,
  manageBankingDetails,
} from "../../config/bankDetails";
import { useSelector } from "react-redux";
import { useModal } from "../../context/ModalContext";
import { getUser } from "../../config/user";
import { customModal } from "../../utils/modalUtils";
import { CheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import DotLoader from "../../components/DotLoader";

export default function BankDetails() {
  const user = useSelector((state) => state.user);
  const { showModal } = useModal();
  const [formData, setFormData] = useState({
    accountName: "",
    bankName: "",
    branch: "",
    bsbNumber: "",
    accountNumber: "",
    iban: "",
    swiftCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userCountry, setUserCountry] = useState({
    country: "",
  });

  const fetchUserCountry = async () => {
    setIsLoading(true);
    const userUID = user.userId;
    if (!userUID) {
      console.log("No UID found.");
      return;
    }
    try {
      const usersData = await getUser(userUID);
      if (usersData.length > 0) {
        const userData = usersData[0];
        setUserCountry({
          ...userData,
          country: userData.country,
        });
      }
    } catch (error) {
      console.log("Error fetching user data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const country = userCountry.country;

  const fetchBankingDetails = async () => {
    setIsLoading(true);

    if (!user) {
      console.log("No user is currently authenticated.");
      return;
    }

    try {
      const data = await getBankingDetails(user.userId);

      if (data.length > 0) {
        const bankingDetails = data[0];
        setFormData({
          accountName: bankingDetails.accountName,
          bankName: bankingDetails.bankName,
          branch: bankingDetails.branch,
          bsbNumber: bankingDetails.bsbNumber,
          accountNumber: bankingDetails.accountNumber,
          iban: bankingDetails.iban,
          swiftCode: bankingDetails.swiftCode,
        });
      }
    } catch (error) {
      console.error("Error fetching banking details: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBankingDetails();
    fetchUserCountry();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user) {
      console.log("No user is currently authenticated.");
      return;
    }

    const bankingDetailsData = {
      accountName: formData.accountName,
      bankName: formData.bankName,
      branch: formData.branch,
      bsbNumber: formData.bsbNumber,
      accountNumber: formData.accountNumber,
      iban: formData.iban,
      swiftCode: formData.swiftCode,
    };

    try {
      const userBankingDetails = await getBankingDetails(user.userId);

      if (userBankingDetails && userBankingDetails.length > 0) {
        const docId = userBankingDetails[0].id;
        await manageBankingDetails(user.userId, bankingDetailsData, docId);
        customModal({
          showModal,
          icon: CheckIcon,
          iconBgColor: "bg-green-100",
          iconTextColor: "text-green-600",
          title: "Success!",
          text: `Banking details updated successfully!`,
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        await manageBankingDetails(user.userId, bankingDetailsData);
        customModal({
          showModal,
          icon: CheckIcon,
          iconBgColor: "bg-green-100",
          iconTextColor: "text-green-600",
          title: "Success!",
          text: `Banking details added successfully!`,
          showConfirmButton: false,
          timer: 2000,
        });
      }

      fetchBankingDetails(); // fetch details again after saving or adding
    } catch (error) {
      console.error("Error submiting banking details: ", error);
      customModal({
        showModal,
        icon: XCircleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        title: "Oops!",
        text: `Failed to submit banking details. Please try again.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Bank Details
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Confirm your details and ensure they are correct before submitting.
        </p>
      </div>

      <form
        className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
        onSubmit={handleUpdate}
      >
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="account-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Account Holder's Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="account_name"
                  value={formData.accountName}
                  onChange={(e) =>
                    setFormData({ ...formData, accountName: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="bank-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Bank Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {country === "AU" && (
              <div className="col-span-full">
                <label
                  htmlFor="branch-address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Branch Address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}

            <div className="sm:col-span-3">
              <label
                htmlFor="bsb-number"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                BSB Number
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="bsbNumber"
                  placeholder="6 digits"
                  value={formData.bsbNumber}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="account-number"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Account Number
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="6-10 digits"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {country !== "Australia" && (
              <>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="iban"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    IBAN
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="iban"
                      placeholder="6-10 digits"
                      value={formData.iban}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="swift-code"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    BIC/Swift Code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="swiftCode"
                      placeholder="6-10 digits"
                      value={formData.swiftCode}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isLoading ? (
              <div className="flex w-full justify-center align-middle gap-2">
                <span>Submitting</span>
                <DotLoader />
              </div>
            ) : (
              "Update Details"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
