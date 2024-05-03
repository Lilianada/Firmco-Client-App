import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import Background from "../../assets/Background.jpg";
import { EyeIcon, EyeSlashIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { auth, db, storage } from "../../config/firebase";
import DotLoader from "../../components/DotLoader";
import { customAlert } from "../../utils/alertUtils";
import { useAlert } from "../../context/AlertContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { addLogNotification } from "../../config/utils";
import { useDispatch, useSelector } from "react-redux";
import { setUserName, setUserId } from "../../store/actions/userActions";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const { showAlert, hideAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const result = useSelector((state) => state.user.name);

  const fetchWhiteLogo = async () => {
    const storageRef = ref(
      storage,
      "gs://fir-app-6e8f9.appspot.com/logos/darkLogo/"
    );
    try {
      const logoUrl = await getDownloadURL(storageRef);
      setLogoUrl(logoUrl);
    } catch (error) {
      console.error("Error fetching Logo:", error);
    }
  };

  useEffect(() => {
    fetchWhiteLogo();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/onboard");
      } else {
        return;
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const userUID = user.uid;

      const userRef = doc(db, "users", userUID);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        customAlert({
          showAlert,
          title: 'Error',
          description: 'This user does not exist.',
          icon: ExclamationCircleIcon,
          iconBgColor: 'bg-red-100',
          iconTextColor: 'bg-red-600',

        });
        setIsLoading(false);
        return;
      }

      const userData = userDoc.data();
      const nameParts = userData.fullName;

      // Dispatch Redux action to save the user's first name
      dispatch(setUserName(nameParts));
      dispatch(setUserId(user.uid));

      await updateDoc(userRef, { isLoggedIn: true });
      await addLogNotification(userRef, user);

      if(result  === nameParts) {
        navigate("/onboard");
      }
    } catch (error) {
      customAlert({
        showAlert,
        title: "Access Denied",
        description: error.message,
        textColor: "text-red-800",
        icon: XCircleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        list: false,
        onClose: hideAlert,
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-blue-50">
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96 text-left">
            <div>
              <img className="h-12 w-auto" src={logoUrl} alt="Company Logo" />
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                To access your dashboard, please login with your info.
              </p>
            </div>

            <div className="mt-10">
              <form
                action="#"
                method="POST"
                className="space-y-6"
                onSubmit={handleLogin}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <input
                      className="bg-white focus:bg-blue-50 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="password"
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 block text-sm leading-6 text-gray-700"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm leading-6">
                    <Link
                      to="/forgot-password"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center align-middle rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {isLoading ? (
                      <div className="flex w-full justify-center align-middle gap-2">
                        <span>Loading</span>
                        <DotLoader />
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-4">
              <p className="text-center text-sm leading-6 text-gray-500">
                Not a member?{" "}
                <Link
                  to="/sign-up"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={Background}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
