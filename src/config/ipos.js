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
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase"; 
import { getCurrentDate } from "./utils";

const USERS_COLLECTION = "users";
const ADMIN_DASH_COLLECTION = "admin_users";
const ADMINUSERS_COLLECTION = "adminUsers";

// IPOS
const IPOS_COLLECTION = "ipos";

//getIPOS
export const getIpos = async () => {
  const iposQuery = query(
    collection(db, IPOS_COLLECTION)
  );
  const querySnapshot = await getDocs(iposQuery);

  if (querySnapshot.empty) {
    return null; 
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

//INVEST
export async function investInIPO(userId, investmentData) {
  try {
    const userDocRef = doc(db, ADMIN_DASH_COLLECTION, userId);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      await setDoc(userDocRef, { userId });
    }

    const investAmountCollectionRef = collection(
      userDocRef,
      "ipoInvestmentRequests"
    );

    // constructing the investment data object
    const investmentDataObj = {
      ...investmentData,
      status: "Pending", 
      timestamp: getCurrentDate(),
    };

    // adding the investment data to the investAmount sub-collection
    const docRef = await addDoc(investAmountCollectionRef, investmentDataObj);

    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const userFullName = userData.fullName;
      const notificationData = {
        message: `User '${userFullName}' made a request to invest IPOs`,
        timeStamp: new Date(),
      };
      await addDoc(
        collection(
          db,
          ADMINUSERS_COLLECTION,
          "notifications",
          "iposNotifications"
        ),
        notificationData
      );
    } else {
      console.error("User not found in Firestore.");
    }

    return docRef.id; // returning the id of the newly created document
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; // rethrowing the error after logging it
  }
}

//SELL
export async function sellIPO(userId, investmentData) {
  try {
    // Check if a document with the user ID already exists
    const userDocRef = doc(db, ADMIN_DASH_COLLECTION, userId);
    const docSnap = await getDoc(userDocRef);

    // If it does not exist, create the document with the user ID
    if (!docSnap.exists()) {
      await setDoc(userDocRef, { userId }); // Set initial data as needed
    }

    // creating a reference to the investAmount sub-collection of the user’s document
    const investAmountCollectionRef = collection(
      userDocRef,
      "ipoInvestmentRequests"
    );

    // constructing the investment data object
    const investmentDataObj = {
      ...investmentData,
      status: "Pending", 
      timestamp: getCurrentDate(),
    };

    // adding the investment data to the investAmount sub-collection
    const docRef = await addDoc(investAmountCollectionRef, investmentDataObj);

    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const userFullName = userData.fullName;
      const notificationData = {
        message: `User '${userFullName}' made a request to sell IPOs`,
        timeStamp: new Date(),
      };
      await addDoc(
        collection(
          db,
          ADMINUSERS_COLLECTION,
          "notifications",
          "iposNotifications"
        ),
        notificationData
      );
    } else {
      console.error("User not found in Firestore.");
    }

    return docRef.id; // returning the id of the newly created document
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; // rethrowing the error after logging it
  }
}

//Get Users Ipos
export async function getUserIpos(uid) {
  const iposQuery = query(
    collection(db, USERS_COLLECTION, uid, IPOS_COLLECTION)
    // orderBy("date")
  );
  const querySnapshot = await getDocs(iposQuery);

  if (querySnapshot.empty) {
    return null; // Return null if no ipos are found
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}
