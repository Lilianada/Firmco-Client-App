/*
* @license
* Copyright 2022 Google LLC
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
import { addDoc, collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db, storage } from "./firebase";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";
import { format, isToday, isYesterday } from "date-fns";


const ADMIN_DASH_COLLECTION = "admin_users";
const USERS_REQUESTS = "userRequests";
const ADMINUSERS_COLLECTION = "adminUsers";

export function logoutAndRedirectToLogin() {
  const authInstance = getAuth();
  const user = authInstance.currentUser;

  if (!user) {
    console.log("No user is currently authenticated.");
    return;
  }

  // Sign out the user
  signOut(authInstance)
    .then(() => {
      const navigate = useNavigate();
      navigate("/");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}

// Get Current Date
export function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Format Number
export function formatNumber(number) {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}


export function convertToNumber(stringAmount) {
  // Check if the input is already a number, and if not, convert it
  if (typeof stringAmount === "string") {
    return parseFloat(stringAmount.replace(",", ""));
  } else if (typeof stringAmount === "number") {
    return stringAmount;
  }
  return 0;
}


export  const formatTimestamp = (timeStamp) => {
  if (!timeStamp) return "";

  const date = timeStamp.toDate(); // Convert Firestore timestamp to JavaScript Date object

  if (isToday(date)) {
    // If the message was sent today, return only the time
    return format(date, "p"); // 'p' is for the local time format
  } else if (isYesterday(date)) {
    // If the message was sent yesterday, return 'Yesterday'
    return "Yesterday";
  } else {
    // Otherwise, return the full date
    return format(date, "PPP"); // 'PPP' is for the longer date format, e.g., Jun 20, 2020
  }
};

export async function addUserRequestToFirestore(formData) {
  try {
    const adminDashRef = await addDoc(
      collection(db, ADMIN_DASH_COLLECTION),
      {}
    );

    const userRequestRef = await addDoc(
      collection(db, ADMIN_DASH_COLLECTION, adminDashRef.id, USERS_REQUESTS),
      {
        ...formData,
      }
    );
    return userRequestRef.id;
  } catch (error) {
    console.error("Error adding user request to Firestore:", error);
    return null;
  }
}

// Function to add login/logout notification to Admin Dashboard
export async function addLogNotification(userRef) {
  try {
    // Fetch the user's data to determine the login status
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const isLoggedIn = userData.isLoggedIn; // Assuming 'isLoggedIn' is a boolean field in the user's data

      // Create a notification message based on the login status
      const adminNotification = isLoggedIn
        ? `User '${userData.fullName}' logged in`
        : `User '${userData.fullName}' logged out`;

      // Send the notification to the admin_users collection
      const notificationData = {
        message: adminNotification,
        // date: getCurrentDate(),
        timeStamp: new Date(),
        isLoggedIn: isLoggedIn,
      };

      // Construct the Firestore references for admin dashboard and sub-collection
      const adminDashRef = collection(db, ADMINUSERS_COLLECTION);
      const notificationDashRef = doc(adminDashRef, "notifications");
      const subCollectionName = isLoggedIn
        ? "loginNotifications"
        : "logoutNotifications";
      const notificationsRef = collection(
        notificationDashRef,
        subCollectionName
      );

      await addDoc(notificationsRef, notificationData);
      return notificationData;
    } else {
      console.error("User not found in Firestore.");
      return null;
    }
  } catch (error) {
    console.error("Error adding user login notification to Firestore:", error);
    return null;
  }
}


// Function to fetch the password policy setting from Firestore
export const fetchPasswordPolicySetting = async () => {
  try {
    const docRef = doc(db, ADMINUSERS_COLLECTION, "strongPasswordPolicy");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const isStrong = docSnap.data().isTrue;
      return isStrong;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error fetching password policy: ", error);
    throw error;
  }
};

//display tool featute
export const displayToolsFeature = (setIsToolsVisible) => {
  try {
    const docRef = doc(db, "adminUsers", "toolFeature");

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setIsToolsVisible(doc.data().isDisplayed);
      } else {
        return;
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

//display bonds feature
export const displayBondsFeature = (setIsBondsVisible) => {
  try {
    const docRef = doc(db, "adminUsers", "bondsFeature");

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setIsBondsVisible(doc.data().isTrue);
      } else {
        return;
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

//display fixed term feature
export const displayFixedTermFeature = (setIsFixedTermVisible) => {
  try {
    const docRef = doc(db, "adminUsers", "termsFeature");

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setIsFixedTermVisible(doc.data().isTrue);
      } else {
        return;
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

//display ipo feature
export const displayIpoFeature = (setIsIpoVisible) => {
  try {
    const docRef = doc(db, "adminUsers", "iposFeature");

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setIsIpoVisible(doc.data().isTrue);
      } else {
        return;
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

//display ipos tables feature
export const displayIposTable = (setIsIposVisible) => {
  try {
    const docRef = doc(db, "adminUsers", "iposTableFeature");

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setIsIposVisible(doc.data().isTrue);
      } else {
        return;
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

//fetch logo
export const fetchLogo = async (setLogo) => {
  const storageRef = ref(
    storage,
    "gs://cvs-online.appspot.com/logos/darkLogo/"
  );
  try {
    const logoUrl = await getDownloadURL(storageRef);
    return setLogo(logoUrl);
  } catch (error) {
    console.error("Error fetching whiteLogo:", error);
  }
};
