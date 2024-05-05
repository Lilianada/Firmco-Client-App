import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserKycCompletion } from "../../config/user";

export default function WelcomePage() {
  const user = useSelector((state) => state.user);
  const [kycCompletion, setKycCompletion] = useState(null);
  const userId = user.userId;

  const isKycComplete = async () => {
    try {
      const completion = await getUserKycCompletion(userId);
      setKycCompletion(completion);
      console.log(`KYC Completion: ${completion}%`);
    } catch (error) {
      console.error("Error fetching KYC completion:", error);
      setKycCompletion("none");
    }
  };

  useEffect(() => {
    isKycComplete();
  }, []);

  return (
    <div className="bg-gray-800 sm:bg-custom-pattern bg-cover bg-center h-screen grid place-items-center">
      <div className="mx-auto max-w-7xl py-4 px-2 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-50 px-6 py-12 text-center shadow-2xl rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            Hello {user.name},
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-6 sm:leading-8 text-gray-600">
            Welcome to Firmco Online Portfolio Management. {""}
            {kycCompletion === 0 || kycCompletion === "none"
              ? "Kindly begin the process of completing your KYC information."
              : kycCompletion < 100
              ? `You have completed only ${kycCompletion}% of your KYC, you have ${
                  100 - kycCompletion
                }% more to go.`
              : "Your KYC is fully completed. Thank you!"}
          </p>
          {kycCompletion !== 100 && (
            <div className="flex mt-10 items-center justify-center gap-x-6">
              <Link
                to="/kyc-form"
                className="rounded-md bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {kycCompletion === 0 || kycCompletion === "none"
                  ? "Start KYC"
                  : "Complete KYC"}
              </Link>
              {kycCompletion !== 0 && (
                <Link
                  to="/dashboard"
                  className="text-sm font-semibold leading-6 text-gray-800"
                >
                  Explore your account <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          )}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
