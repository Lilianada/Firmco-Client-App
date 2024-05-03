import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from "firebase/auth";
import Logo from "../../assets/logo.png";
import { CheckIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { db } from "../../config/firebase";
import Select from "react-select";
import {
  addUserRequestToFirestore,
  fetchPasswordPolicySetting,
  getCurrentDate,
} from "../../config/utils";
import { useAuth } from "../../context/authContext";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { customModal } from "../../utils/modalUtils";
import { useModal } from "../../context/ModalContext";
import { collection, getDocs } from "firebase/firestore";
import PhoneVerification from "./PhoneValidation";
import DotLoader from "../../components/DotLoader";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import PasswordTooltip from "../../components/PasswordTooltip";

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
    onChange({ target: { name: "country", value: selectedOption } });
  };

  return (
    <Select
      options={countries}
      value={value}
      onChange={handleCountryChange}
      className="bg-white focus:bg-blue-50 block w-full placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    />
  );
};

const validatePassword = (pass, isStrongPolicy) => {
  if (isStrongPolicy) {
    const regex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pass);
  } else {
    return pass.length >= 6;
  }
};


export default function Register() {
  const { showModal } = useModal();
  const initialFormState = {
    fullName: "",
    email: "",
    address: "",
    country: "",
    mobilePhone: "",
    password: "",
    confirmPassword: "",
    jointAccount: false,
    secondaryAccountHolder: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStrongPasswordPolicy, setIsStrongPasswordPolicy] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState(
    new Array(6).fill("")
  );
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [verificationModal, setVerificationModal] = useState(false);
  const [counter, setCounter] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const auth = getAuth();

  const { setPhoneAuthData } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFirebaseError = (error) => {
    let errorMessage = "";
    switch (error) {
      case "auth/internal-error":
        errorMessage = "Something went wrong. Please try again.";
        console.log(error);
        break;
      case "auth/error-code:-39":
        errorMessage =
          "We're experiencing technical difficulties. Please try again later.";
        break;
      case "auth/argument-error":
        errorMessage =
          "We're experiencing technical difficulties. Please try again later.";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many request attempts. Please try again later.";
        break;
      case "auth/invalid-phone-number":
        errorMessage = "Invalid phone number. Please try again.";
        break;
      case "auth/invalid-verification-code":
        errorMessage = "Invalid verification code. Please try again.";
        break;
      case "auth/code-expired":
        errorMessage =
          "Verification code has expired. Please request a new code.";
        break;
      case "auth/missing-verification-code":
        errorMessage = "Please enter the verification code.";
        break;
      case "reCAPTCHA has already been rendered in this element":
        errorMessage = "Something went wrong. Please try again.";
        break;
      case "auth/network-request-failed":
        errorMessage =
          "Something went wrong. Please reload page and try again.";
        break;
      case "auth/user-not-found":
        errorMessage = "User not found. Please sign up.";
        break;
      case "auth/email-already-in-use":
        errorMessage =
          "Email address already in use. Please try a different email.";
        break;
      default:
        errorMessage = error;
        break;
    }
    setErrorWithTimeout(errorMessage);
  };

  useEffect(() => {
    if (error) {
      handleFirebaseError(error);
    }
  }, [error]);

  useEffect(() => {
    fetchPasswordPolicySetting()
      .then((isStrong) => {
        setIsStrongPasswordPolicy(isStrong);
      })
      .catch((error) => {
        console.error("Error fetching password policy:", error);
      });
  }, []);

  useEffect(() => {
    // Clear the reCAPTCHA widget when unmounts
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        if (error) {
          handleFirebaseError(error);
        }
      }
    };
  }, []);

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      return customModal({
        showModal,
        title: "Error",
        text: "Passwords do not match.",
        icon: ExclamationCircleIcon,
        showConfirmButton: false,
        timer: 3000,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
      });
    }

    if (!validatePassword(formData.password, isStrongPasswordPolicy)) {
      setIsLoading(false);
      return isStrongPasswordPolicy
        ? customModal({
            showModal,
            title: "Error",
            text: "Password must be at least 8 characters long, must contain at least one number and a special character.",
            icon: ExclamationCircleIcon,
            showConfirmButton: false,
            timer: 3000,
            iconBgColor: "bg-red-100",
            iconTextColor: "text-red-600",
            buttonBgColor: "bg-red-600",
          })
        : customModal({
            showModal,
            title: "Error",
            text: "Password must be at least 6 digits long.",
            icon: ExclamationCircleIcon,
            showConfirmButton: false,
            timer: 3000,
            iconBgColor: "bg-red-100",
            iconTextColor: "text-red-600",
            buttonBgColor: "bg-red-600",
          });
    }
    
    return;
  };

  const handleChange = (e) => {
    if (e && e.target) {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;
      setFormData({
        ...formData,
        [name]: newValue,
      });
    }
  };

  const setErrorWithTimeout = (errorMessage) => {
    setError(errorMessage);
    customModal({
      showModal,
      title: "Error",
      text: errorMessage,
      icon: ExclamationCircleIcon,
      showConfirmButton: false,
      timer: 3000,
      iconBgColor: "bg-red-100",
      iconTextColor: "text-red-600",
      buttonBgColor: "bg-red-600",
    });
    return;
  };

  const sendUserRequest = async () => {
    const userRequest = {
      fullName: formData.fullName,
      email: formData.email,
      address: formData.address,
      country: formData.country.label,
      mobilePhone: formData.mobilePhone,
      password: formData.password,
      jointAccount: formData.jointAccount,
      secondaryAccountHolder: formData.secondaryAccountHolder,
      status: "pending",
      createdAt: getCurrentDate(),
    };

    // Add user request to Firestore
    const userRequestId = await addUserRequestToFirestore(userRequest);

    if (!userRequestId) {
      throw new Error("Failed to send signup request.");
    }
    customModal({
      showModal,
      title: "Error",
      text: "Signup successful. Please wait for admin approval.",
      icon: CheckIcon,
      showConfirmButton: false,
      timer: 2000,
      iconBgColor: "bg-green-100",
      iconTextColor: "text-green-600",
      buttonBgColor: "bg-green-600",
    });
    setVerificationModal(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const code = verificationCode.join("");

    try {
      await confirmationResult.confirm(code);
      setIsVerified(true);
      sendUserRequest();
    } catch (error) {
      console.error(error);
      handleFirebaseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkForUser = async (email, mobilePhone) => {
    const adminDashRef = collection(db, "admin_users");
    let userExists = false;
    try {
      const querySnapshot = await getDocs(adminDashRef);
      for (const doc of querySnapshot.docs) {
        const userRequestRef = collection(
          db,
          "admin_users",
          doc.id,
          "userRequests"
        );
        const userRequestsSnapshot = await getDocs(userRequestRef);

        // eslint-disable-next-line no-loop-func
        userRequestsSnapshot.forEach((userDoc) => {
          if (
            userDoc.data().email === email ||
            userDoc.data().mobilePhone === mobilePhone
          ) {
            userExists = true;
          }
        });

        if (userExists) {
          setErrorWithTimeout(
            "User already exists with this email or phone number."
          );
          setIsLoading(false);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error checking for user:", error);
      return false;
    }
  };

  const sendVerificationCode = async () => {
    setIsLoading(true);
    const userExists = await checkForUser(formData.email, formData.mobilePhone);
    if (userExists === false || !userExists) {
      try {
        const confirmation = await signInWithPhoneNumber(
          auth,
          formData.mobilePhone,
          window.recaptchaVerifier
        );
        setConfirmationResult(confirmation);
        setPhoneAuthData({
          phoneNumber: formData.mobilePhone,
          confirmationResult: confirmation,
        });
        customModal({
          showModal,
          title: "Verification Code Sent",
          text: "Please check your phone for the verification code.",
          icon: CheckIcon,
          showConfirmButton: false,
          timer: 2000,
          iconBgColor: "bg-green-100",
          iconTextColor: "bg-green-600",
          buttonBgColor: "bg-green-600",
        });
        setVerificationModal(true);
      } catch (error) {
        handleFirebaseError(error.code);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resendVerificationCode = () => {
    if (!canResend) return;
    setCanResend(false);
    setCounter(15);
    sendVerificationCode();
  };

  const resendCode = () => {
    setCounter(15);
    setCanResend(false);
    resendVerificationCode();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const passwordValidationResult = validatePasswords();
    if (passwordValidationResult) {
      setErrorWithTimeout(passwordValidationResult);
      customModal({
        showModal,
        title: "Verification Code Sent",
        text: "Please check your phone for the verification code.",
        icon: CheckIcon,
        showConfirmButton: false,
        timer: 2000,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorWithTimeout("Passwords do not match.");
      return;
    }

    if (!validatePassword(formData.password, isStrongPasswordPolicy)) {
      setErrorWithTimeout("Password must meet the required criteria.");
      return;
    }

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "sign-up-button",
        {
          size: "invisible",
          callback: (response) => {},
          "expired-callback": () => {},
        },
        auth
      );

      // Send the verification code
      sendVerificationCode();
    } catch (error) {
      console.error(error);
      handleFirebaseError(error.code);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-blue-50">
      <div className="flex min-h-full flex-1">
        <div className="relative hidden w-0 flex-1 lg:block bg-custom-pattern sm:bg-custom-pattern bg-cover bg-center">
          <img
            className="h-10 w-auto mt-6 ml-4"
            src={Logo}
            alt="Firmco Online Portfolio Management"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center px-4 py-12 lg:py-4 sm:px-6 lg:flex-none lg:px-16 xl:px-20">
          <div className="mx-auto w-full max-w-[28rem] text-left">
            <img
              className="block lg:hidden h-10 w-auto"
              src={Logo}
              alt="Firmco Online Portfolio Management"
            />
            <div>
              <h2 className="mt-4 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Register to become a member
              </h2>
              <p className="text-sm leading-6 text-gray-500">
                Become a user by creating an account.
              </p>
            </div>

            <div className="mt-10">
              <div>
                <form
                  action="#"
                  method="POST"
                  onSubmit={handleSignup}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="remember-me"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Joint Account
                    </label>
                    <input
                      type="checkbox"
                      name="jointAccount"
                      checked={formData.jointAccount}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="full-name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Full Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Primary Account Holder Full Name"
                        required
                        className="bg-white focus:bg-blue-50 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {formData.jointAccount && (
                    <div>
                      <label
                        htmlFor="secondary-AccountHolder"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Secondary Holder Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="secondaryAccountHolder"
                          placeholder="Secondary Account Holder Full Name"
                          value={formData.secondaryAccountHolder}
                          onChange={handleChange}
                          className="bg-white focus:bg-blue-50 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid max-w-2xl grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-6 md:col-span-2">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-white focus:bg-blue-50 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="mobilePhone"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Phone Number
                      </label>
                      <div className="mt-2">
                        <PhoneInput
                          type="tel"
                          name="mobilePhone"
                          countrySelectProps={{ unicodeFlags: true }}
                          defaultCountry="US"
                          placeholder="Phone Number"
                          international
                          value={formData.mobilePhone}
                          onChange={(value) =>
                            setFormData({ ...formData, mobilePhone: value })
                          }
                          required
                          minLength={10}
                          className="bg-white focus:bg-blue-50 border-0 rounded-md focus:ring-0 focus:ring-inset focus:ring-indigo-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid max-w-2xl grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-6 md:col-span-2">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Country
                      </label>
                      <div className="mt-2">
                        <CountrySelect
                          value={formData.country}
                          onChange={handleChange}
                          className="bg-white focus:bg-blue-50 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Address
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="address"
                          placeholder="Address"
                          value={formData.address}
                          onChange={handleChange}
                          className="bg-white focus:bg-blue-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          autoComplete="street-address"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid max-w-2xl grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-6 md:col-span-2">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="password"
                        className="flex items-center gap-1 text-sm font-medium leading-6 text-gray-900"
                      >
                        Password
                        <PasswordTooltip/>
                      </label>
                      <div className="relative mt-2 rounded-md shadow-sm">
                        <input
                          className="bg-white focus:bg-blue-50 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          autoComplete="new-password"
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
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Confirm Password
                      </label>
                      <div className="relative mt-2 rounded-md shadow-sm">
                        <input
                          className="bg-white focus:bg-blue-50 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          autoComplete="confirm-password"
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
                    </div>
                  </div>
                  <div>
                    <button
                      id="sign-up-button"
                      type="submit"
                      className="mt-8 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {isLoading ? (
                        <div className="flex w-full justify-center align-middle gap-2">
                          <span>Signing up</span>
                          <DotLoader />
                        </div>
                      ) : (
                        "Sign up"
                      )}
                    </button>
                  </div>
                </form>
                <div className="mt-4">
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Already a member?{" "}
                    <Link
                      to="/"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Sign in.
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {verificationModal && (
          <PhoneVerification
            isOpen={verificationModal}
            onClose={() => setVerificationModal(false)}
            onVerify={handleVerifyCode}
            onResend={resendCode}
            isLoading={isLoading}
            canResend={canResend}
            counter={counter}
            setCounter={setCounter}
            setCanResend={setCanResend}
            error={error}
            successMessage={successMessage}
            phone={formData.mobilePhone}
            setPhoneNumber={(value) => {
              setFormData({
                ...formData,
                mobilePhone: value,
              });
            }}
            code={verificationCode}
            setCode={setVerificationCode}
          />
        )}
      </div>
    </div>
  );
}
