import { useEffect, useReducer, useState } from "react";
import logo from "../../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import {
  applyActionCode,
  confirmPasswordReset,
  getAuth,
  verifyPasswordResetCode,
} from "firebase/auth";
import { fetchPasswordPolicySetting } from "../../../config/utils";
import { useModal } from "../../../context/ModalContext";
import { customModal } from "../../../utils/modalUtils";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import ResetPasswordForm from "./ResetPasswordForm";
import ResetPasswordSuccess from "./ResetPasswordSuccess";
import DotLoader from "../../../components/DotLoader";

// Define action types
const ACTIONS = {
  PASSWORD_CHANGE: "PASSWORD_CHANGE",
  RESET_FORM: "RESET_FORM",
  SHOW_MESSAGE: "SHOW_MESSAGE",
  SHOW_ERROR: "SHOW_ERROR",
  LOADING: "LOADING",
};

const initialState = {
  password: "",
  confirmPassword: "",
  message: "",
  error: "",
  stage: "form",
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.PASSWORD_CHANGE:
      return { ...state, [action.field]: action.value };
    case ACTIONS.RESET_FORM:
      return { ...initialState, stage: "form", loading: false };
    case ACTIONS.SHOW_MESSAGE:
      return {
        ...state,
        stage: "success",
        message: action.message,
        loading: false,
      };
    case ACTIONS.SHOW_ERROR:
      return { ...state, stage: "form", error: action.error, loading: false };
    case ACTIONS.LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
}

function validatePassword(pass, isStrongPolicy) {
  if (isStrongPolicy) {
    const regex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pass);
  } else {
    return pass.length >= 6;
  }
}

export default function AuthAction() {
  const { showModal } = useModal();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [message, setMessage] = useState("Verifying your email ");
  const navigate = useNavigate();
  const auth = getAuth();
  const [isStrongPasswordPolicy, setIsStrongPasswordPolicy] = useState(true);
  const location = useLocation();
  const [action, setAction] = useState("");
  const [oobCode, setOobCode] = useState("");

  // Fetch the password policy setting from Firestore.
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
    const auth = getAuth();
    const urlParams = new URLSearchParams(location.search);
    const mode = urlParams.get("mode");
    const actionCode = urlParams.get("oobCode");
    setOobCode(actionCode);

    switch (mode) {
      case "verifyEmail":
        setAction("verifyEmail");
        handleVerifyEmail(auth, actionCode);
        break;
      case "resetPassword":
        setAction("resetPassword");
        handleResetPassword(auth, actionCode)
          .then(() => setMessage("Please enter your new password."))
          .catch((error) =>
            customModal({
              showModal,
              title: "Error",
              text: "Invalid or expired link for password reset.",
              showConfirmButton: false,
              iconBgColor: "bg-red-100",
              iconTextColor: "text-red-600",
              buttonBgColor: "bg-red-600",
              icon: ExclamationTriangleIcon,
              timer: 1500,
            })
          );
        break;
      default:
        console.error("No action specified.");
        break;
    }
  }, [navigate, location.search, auth]);

  const handleVerifyEmail = async (auth, actionCode) => {
    try {
      await applyActionCode(auth, actionCode);
      customModal({
        showModal,
        title: "Email Verified",
        text: "Your email has been verified. You can now log in.",
        showConfirmButton: false,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        icon: CheckIcon,
        timer: 3000,
      });
    } catch (error) {
      console.error("Error verifying email:", error);
      customModal({
        showModal,
        title: "Error",
        text: "Error verifying email. Please try again.",
        showConfirmButton: false,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        icon: ExclamationTriangleIcon,
        timer: 2000,
      });
    }
  };

  async function handleResetPassword(auth, actionCode) {
    try {
      const userEmail = await verifyPasswordResetCode(auth, actionCode);
      return userEmail;
    } catch (error) {
      dispatch({
        type: ACTIONS.SHOW_ERROR,
        error: "Error verifying the password reset token.",
      });
      console.error("Error verifying the password reset token:", error);
      return null;
    }
  }

  async function updatePasswordForUser(code, newPassword) {
    try {
      await confirmPasswordReset(auth, code, newPassword);
      dispatch({
        type: ACTIONS.SHOW_MESSAGE,
        message: "Password updated successfully.",
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.SHOW_ERROR,
        error: "Error updating the password. Please try again.",
      });
      console.error("Error updating password:", error);
    }
  }

  const validatePasswords = () => {
    if (state.password !== state.confirmPassword) {
      dispatch({
        type: ACTIONS.SHOW_ERROR,
        error: "New password and confirm password do not match.",
      });
      return false;
    }
    if (!validatePassword(state.password, isStrongPasswordPolicy)) {
      dispatch({
        type: ACTIONS.SHOW_ERROR,
        error: isStrongPasswordPolicy
          ? "Password must be at least 8 characters long, must contain at least one number and a special character."
          : "Password must be at least 6 digits long.",
      });
      return false;
    }
    return true;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!state.password || !state.confirmPassword) {
      // handle error
      return;
    }

    dispatch({ type: ACTIONS.LOADING });

    if (!validatePasswords()) {
      return;
    }

    const resetPasswordToken = new URLSearchParams(window.location.search).get(
      "oobCode"
    );

    if (!resetPasswordToken) {
      dispatch({
        type: ACTIONS.SHOW_ERROR,
        error: "Password reset token is missing or invalid.",
      });
      return;
    }
    try {
      await updatePasswordForUser(resetPasswordToken, state.password);
    } catch (error) {
      console.error("Error during password reset:", error);
    }
  };

  return (
    <>
      {action === "resetPassword" && state.stage === "form" && (
        <ResetPasswordForm
          state={state}
          dispatch={dispatch}
          handleChangePassword={handleChangePassword}
          ACTIONS={ACTIONS}
          isStrongPolicy={isStrongPasswordPolicy}
        />
      )}

      {action === "resetPassword" && state.stage === "success" && (
        <ResetPasswordSuccess state={state} navigate={navigate} />
      )}

      {action === "verifyEmail" && (
        <div className="grid min-h-full h-screen flex-1 place-items-center justify-center py-12 sm:px-6 bg-blue-50 lg:px-8 sm:bg-custom-pattern bg-cover bg-center">
          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-blue-50 p-6 sm:shadow sm:rounded-lg">
              <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                <img
                  className="mx-auto h-10 w-auto"
                  src={logo}
                  alt="Company Logo"
                />
                <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  Email Verification
                </h2>
                <p className="mt-2 text-sm text-gray-700 text-center flex  gap-2">
                  {message}<DotLoader/>
                </p>
              </div>

              {message ===
                "Your email has been verified. You can now log in." && (
                <p className="text">Redirecting to the login page...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
