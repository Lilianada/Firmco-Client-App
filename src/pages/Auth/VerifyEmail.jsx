import React, { useState } from 'react'
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../../config/firebase';
import logo from '../../assets/logo.png';
import DotLoader from '../../components/DotLoader';
import { useModal } from '../../context/ModalContext';
import { customModal } from '../../utils/modalUtils';
import { CheckIcon } from '@heroicons/react/20/solid';

export default function VerifyEmail() {
    const { showModal } = useModal();
    const [isLoading, setIsLoading] = useState(false);
    console.log(auth.currentUser)
  
    const handleEmailVerification = async () => {
      setIsLoading(true);
  
      try {
        // Send the email verification link
        await sendEmailVerification(auth.currentUser);
        customModal({
            showModal,
            title: "Success",
            text: "Verification email sent. Please check your inbox.",
            showConfirmButton: false,
            iconBgColor: "bg-green-100",
            iconTextColor: "text-green-600",
            buttonBgColor: "bg-green-600",
            icon: CheckIcon,
            timer: 1500,
        });
      } catch (error) {
        console.error(error);
        customModal({
            showModal,
            title: "Error",
            text: "Error sending verification email. Please try again.",
            showConfirmButton: false,
            iconBgColor: "bg-red-100",
            iconTextColor: "text-red-600",
            buttonBgColor: "bg-red-600",
            icon: CheckIcon,
            timer: 1500,
        });
      } finally {
        setIsLoading(false);
      }
    };
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
                  Verify Email Address
                </h2>
                <p className="mt-2 text-sm text-gray-700 text-center">
                Please click the button below to send a verification email to your email address.
                </p>
              </div>
    
              <form
                className="space-y-4 text-left mt-6"
                action="#"
                method="POST"
                onSubmit={handleEmailVerification}
              >
    
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {isLoading ? (
                      <div className="flex w-full justify-center align-middle gap-2">
                        <span>Verifing</span>
                        <DotLoader />
                      </div>
                    ) : (
                      "Verify Email"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
}
