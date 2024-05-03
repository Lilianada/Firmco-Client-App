import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import DotLoader from "../../components/DotLoader";
import { customModal } from "../../utils/modalUtils";
import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useModal } from "../../context/ModalContext";
import { getUser, updateUser } from "../../config/user";
import { setUserName } from "../../store/actions/userActions";

const CountrySelect = ({ value, onChange }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
      });
  }, []);

  const handleCountryChange = (selectedOption) => {
    onChange({ target: { name: "country", value: selectedOption.label } });
  };

  return (
    <Select
      options={countries}
      value={countries.find((c) => c.label === value) || ""}
      onChange={handleCountryChange}
    />
  );
};

export default function Profile() {
  const userUID = useSelector((state) => state.user.userId);
  const { showModal } = useModal();
  const dispatch = useDispatch();
  const [homePhone, setHomePhone] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userUID) {
        console.log("No UID found.");
        return;
      }
      try {
        const usersData = await getUser(userUID);
        if (usersData.length > 0) {
          const userData = usersData[0];
          setUser({
            ...userData,
            title: userData.title,
            fullName: userData.fullName,
            email: userData.email,
            street: userData.address,
            country: userData.country,
            jointAccount: userData.jointAccount,
            secondaryAccountHolder: userData.secondaryAccountHolder,
          });
          setHomePhone(userData.homePhone);
          setMobilePhone(userData.mobilePhone);
        }
      } catch (error) {
        console.log("Error fetching user data: ", error);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userData = {
      fullName: user?.fullName || "",
      title: user?.title || "",
      email: user?.email || "",
      address: user?.street || "",
      city: user?.city || "",
      mobilePhone: mobilePhone || "",
      homePhone: homePhone || "",
      country: user?.country || "",
      postcode: user?.postcode || "",
      jointAccount: user?.jointAccount || false,
      secondaryAccountHolder: user?.secondaryAccountHolder || "",
      secondaryTitle: user?.secondaryTitle || "",
    };
    setIsLoading(true);
    try {
      if (user && userUID) {
        await updateUser(userUID, userData);
        customModal({
          showModal,
          title: "Success!",
          text: "Account information updated!",
          icon: CheckIcon,
          iconBgColor: "bg-green-100",
          iconTextColor: "text-green-600",
          buttonBgColor: "bg-green-600",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      dispatch(setUserName(user.fullName));
    } catch (error) {
      console.log("Error updating/adding user data: ", error);
      customModal({
        showModal,
        title: "Oops!",
        text: "Something went wrong during your submission.",
        icon: ExclamationCircleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setUser((prev) => ({ ...prev, [name]: newValue }));
  };

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Account Information
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Fill the form with your correct details.
        </p>
      </div>

      <form
        onSubmit={handleUpdate}
        className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
      >
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="relative flex gap-x-3 sm:col-span-4">
              <div className="flex h-6 items-center">
                <input
                  type="checkbox"
                  name="jointAccount"
                  id="jointAccount"
                  onChange={handleChange}
                  checked={user?.jointAccount || false}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="text-sm leading-6">
                <label
                  htmlFor="joint-account"
                  className="font-medium text-gray-900"
                >
                  Joint Account
                </label>
                <p className="text-gray-500">
                  Check this box if your accoun is a joint account.
                </p>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Primary Account Holder Title
              </label>
              <div className="mt-2">
                <select
                  id="title"
                  name="title"
                  autoComplete="title"
                  onChange={handleChange}
                  value={user?.title || ""}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="">Select Title</option>
                  <option value="Miss">Miss</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                  <option value="Rev">Rev</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Primary Account Holder Full Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="fullName"
                  id="full-name"
                  onChange={handleChange}
                  value={user?.fullName || ""}
                  required
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {user?.jointAccount && (
              <>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="secondary-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Secondary Account Holder Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="secondaryAccountHolder"
                      id="full-name"
                      onChange={handleChange}
                      value={user?.secondaryAccountHolder || ""}
                      autoComplete="secondaryName"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="secondaryTitle"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Secondary Account Holder Title
                  </label>
                  <div className="mt-2">
                    <select
                      id="secondaryTitle"
                      name="secondaryTitle"
                      autoComplete="secondaryTitle"
                      onChange={handleChange}
                      value={user?.secondaryTitle || ""}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="">Select Title</option>
                      <option value="Miss">Miss</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Mr">Mr</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                      <option value="Rev">Rev</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="sm:col-span-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={user?.email || ""}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="home-phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Home Phone
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="homePhone"
                  id="homePhone"
                  onChange={handleChange}
                  value={user?.homePhone || ""}
                  autoComplete="homePhone"
                  placeholder="e.g. +234-567-8901"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="mobile-phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mobile Phone
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="mobilePhone"
                  id="mobilePhone"
                  required
                  onChange={handleChange}
                  placeholder="e.g. +234-567-8901"
                  value={user?.mobilePhone || ""}
                  autoComplete="mobilePhone"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="home-address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Home address
              </label>
              <div className="mt-2">
                <input
                  id="home-address"
                  name="address"
                  type="text"
                  onChange={handleChange}
                  value={user?.address || ""}
                  required
                  autoComplete="homePhone-address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  onChange={handleChange}
                  value={user?.city || ""}
                  required
                  autoComplete="city"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="region"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                State / Province
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postcode"
                  id="postcode"
                  onChange={handleChange}
                  value={user?.postcode || ""}
                  required
                  autoComplete="post-code"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Country
              </label>
              <CountrySelect
                value={user?.country || ""}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                required
              />
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
                <span>Updating</span>
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
