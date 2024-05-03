import React, { useEffect, useState } from "react";
import {
  cryptoExperiences,
  cryptoInvestments,
  educationExperience,
  familyMembers,
  financialStatus,
  investmentAmount,
  investmentWindow,
  netAnnualIncome,
  occupation,
  plannedInvestments,
  primaryPurpose,
  purposeOfTrading,
  riskReward,
  stockExperiences,
  stockInvestents,
  tradingExperience,
  tradingKnowledgeAssessment,
  tradingStrategy,
} from "../../../config/data";
import { getUserKyc, updateUserKyc } from "../../../config/user";
import { customModal } from "../../../utils/modalUtils";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useModal } from "../../../context/ModalContext";
import { useSelector } from "react-redux";
import FirstSection from "./FirstSection";
import SecondSection from "./SecondSection";
import ThirdSection from "./ThirdSection";
import FourthSection from "./FourthSection";
import FifthSection from "./FifthSection";
import SixthSection from "./SixthSection";
import DotLoader from "../../../components/DotLoader";
import { useNavigate } from "react-router-dom";

export default function KycForm() {
  const [formData, setFormData] = useState({
    eduExperience: "",
    purpose: "",
    tradeExperience: "",
    investments: "",
    investWindow: "",
    tradingKnowledge: "",
    tradeKnowledge: "",
    purposeTrading: "",
    financialStats: [],
    stocksInvestment: "",
    stockExperience: "",
    cryptoExperience: "",
    cryptoInvestment: "",
    leverageExperience: "",
    leverageInvestments: "",
    job: "",
    employerDets: "",
    netIncome: "",
    assets: "",
    investAmount: "",
    risk: {
      name: "",
      limit: "",
    },
    familyAssessment: [],
  });
  const { showModal, hideModal } = useModal();
  const userId = useSelector((state) => state.user.userId);
  const [currentSection, setCurrentSection] = useState(0);
  const totalSections = 6;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const progressPercentage = ((currentSection + 1) / totalSections) * 100;

  useEffect(() => {
    const fetchKycDetails = async () => {
      try {
        const details = await getUserKyc(userId);
        if (details) {
          setFormData((prevDetails) => ({
            ...prevDetails,
            eduExperience: details.eduExperience || [],
            purpose: details.purpose || "",
            tradeExperience: details.tradeExperience || "",
            investments: details.investments || "",
            investWindow: details.investWindow || "",
            tradeKnowledge: details.tradeKnowledge || [],
            tradeStrategy: details.tradeStrategy || "",
            purposeTrading: details.purposeTrading || "",
            financialStats: details.financialStats || [],
            job: details.job || "",
            employerDets: details.employerDets || "",
            stocksInvestment: details.stocksInvestment || "",
            stockExperience: details.stockExperience || "",
            cryptoExperience: details.cryptoExperience || "",
            cryptoInvestment: details.cryptoInvestment || "",
            leverageExperience: details.leverageExperience || "",
            leverageInvestments: details.leverageInvestments || "",
            netIncome: details.netIncome || "",
            assets: details.assets || "",
            investAmount: details.investAmount || "",
            risk: details.risk || { name: "", limit: "" },
            familyAssessment: details.familyAssessment || [],
          }));
        } else {
          setFormData({
            eduExperience: [],
            purpose: "",
            tradeExperience: "",
            investments: "",
            investWindow: "",
            tradeKnowledge: [],
            tradeStrategy: "",
            purposeTrading: "",
            financialStats: [],
            stocksInvestment: "",
            stockExperience: "",
            cryptoExperience: "",
            cryptoInvestment: "",
            leverageExperience: "",
            leverageInvestments: "",
            job: "",
            employerDets: "",
            netIncome: "",
            assets: "",
            investAmount: "",
            risk: {
              name: "",
              limit: "",
            },
            familyAssessment: [],
          });
        }
      } catch (err) {
        console.error("Error fetching KYC details:", err);
      }
    };

    if (userId) {
      fetchKycDetails();
    }
  }, []);

  // Handle field changes for both single and multiple value fields
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
          ? [...prevData[name], value]
          : prevData[name].filter((item) => item !== value),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Example submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await updateUserKyc(
      "v6pygKlYmrSOoJxkh6lpKesG2Bl2",
      formData
    );

    if (response.success) {
      customModal({
        showModal,
        title: "Success!",
        text: "KYC details updated successfully.",
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
        onClose: hideModal,
      });
      navigate("/dashboard");
    } else {
      // Handle the error case
      console.error("Error updating KYC details:", response.error);
      customModal({
        showModal,
        title: "Error!",
        text: `There was a problem updating KYC details: ${response.error}`,
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        onClose: hideModal,
        timer: 3000,
      });
    }

    setIsSubmitting(false);
  };

  const handleSave = async () => {
    const filteredFormData = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        // Ensure we handle arrays for checkboxes or multi-selects that might be empty
        if (Array.isArray(value) && value.length > 0) {
          acc[key] = value;
        } else if (value !== "" && value != null) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    await updateUserKyc("v6pygKlYmrSOoJxkh6lpKesG2Bl2", filteredFormData);
  };

  const handleNext = () => {
    handleSave();
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleGoToSection = (sectionIndex) => {
    setCurrentSection(sectionIndex);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <FirstSection
            formData={formData}
            handleChange={handleInputChange}
            primaryPurpose={primaryPurpose}
            plannedInvestments={plannedInvestments}
            investmentWindow={investmentWindow}
          />
        );
      case 1:
        return (
          <SecondSection
            formData={formData}
            handleChange={handleInputChange}
            stockExperiences={stockExperiences}
            stockInvestents={stockInvestents}
          />
        );
      case 2:
        return (
          <ThirdSection
            formData={formData}
            handleChange={handleInputChange}
            cryptoExperiences={cryptoExperiences}
            cryptoInvestments={cryptoInvestments}
          />
        );
      case 3:
        return (
          <FourthSection formData={formData} handleChange={handleInputChange} />
        );
      case 4:
        return (
          <FifthSection
            formData={formData}
            handleChange={handleInputChange}
            setFormData={setFormData}
            tradingExperience={tradingExperience}
            educationExperience={educationExperience}
            tradingKnowledgeAssessment={tradingKnowledgeAssessment}
            tradingStrategy={tradingStrategy}
            purposeOfTrading={purposeOfTrading}
            investmentAmount={investmentAmount}
            riskReward={riskReward}
            familyMembers={familyMembers}
          />
        );
      case 5:
        return (
          <SixthSection
            formData={formData}
            handleChange={handleInputChange}
            financialStatus={financialStatus}
            occupation={occupation}
            netAnnualIncome={netAnnualIncome}
          />
        );
      default:
        return <div>Section not found.</div>;
    }
  };

  return (
    <div className="px-2 pb-10 lg:px-24 sm:px-8 bg-gray-50 min-h-[calc(100vh_-_64px)]">
      <div className="py-8 text-left">
        <h3 className="text-lg font-semibold leading-6 text-gray-900">
          Know Your Customer Form
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          This information will be used in personalizing your experience.
        </p>

        <div className="mt-6 mb-6" aria-hidden="true">
          <div className="overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-2 bg-indigo-600 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-6 hidden grid-cols-6 text-sm font-medium text-gray-600 sm:grid">
            {Array.from({ length: totalSections }, (_, i) => (
              <button
                key={i}
                onClick={() => handleGoToSection(i)}
                className={`w-full text-center cursor-pointer ${
                  i === currentSection
                    ? "text-indigo-600"
                    : "hover:text-indigo-400"
                }`}
                style={{ padding: "4px 0" }} // Adding padding to increase clickable area
              >
                {`Step ${i + 1}`}
              </button>
            ))}
          </div>
        </div>

        {renderSection()}
      </div>

      <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 mt-4">
        {currentSection < totalSections - 1 ? (
          <>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => navigate("/dashboard")} // Using `navigate` from `react-router-dom`
            >
              Skip for later
            </button>
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleNext}
            >
              Save & Next
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => navigate("/dashboard")} // Using `navigate` from `react-router-dom`
            >
              Skip for later
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex w-full justify-center align-middle gap-2">
                  <span>Submitting</span>
                  <DotLoader />
                </div>
              ) : (
                "Submit KYC Form"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
