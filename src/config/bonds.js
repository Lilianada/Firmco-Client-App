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
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { getCurrentDate } from "./utils";

// const USER_COLLECTION = "users";
const USERS_COLLECTION = "users";
const ADMIN_DASH_COLLECTION = "admin_users";
const ADMINUSERS_COLLECTION = "adminUsers";

//BondsRequest
const BONDS_SUB_COLLECTION = "bonds";
const HOLDINGS_SUB_COLLECTION = "bondsHoldings";
const BONDS_REQUEST_SUB_COLLECTION = "bondsRequest";

export async function getBonds() {
  const bondsQuery = query(
    collection(db, BONDS_SUB_COLLECTION)
    // orderBy("date")
  );
  const querySnapshot = await getDocs(bondsQuery);

  if (querySnapshot.empty) {
    return null; // Return null if no bonds are found
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}

export async function getBondsHoldings(uid) {
  const bondsQuery = query(
    collection(db, USERS_COLLECTION, uid, HOLDINGS_SUB_COLLECTION)
    // orderBy("date")
  );
  const querySnapshot = await getDocs(bondsQuery);

  if (querySnapshot.empty) {
    return null; // Return null if no bonds are found
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}

export async function getBondsRequest(uid) {
  const bondsQuery = query(
    collection(db, USERS_COLLECTION, uid, BONDS_REQUEST_SUB_COLLECTION)
    // orderBy("date")
  );
  const querySnapshot = await getDocs(bondsQuery);

  if (querySnapshot.empty) {
    return null; // Return null if no bonds are found
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}

async function sendRequestAdmin(uid, bondData, typeOfRequest) {
  const userAdminDocRef = doc(db, `${ADMIN_DASH_COLLECTION}/${uid}`);
  // Ensure the document exists before adding to its subcollection
  await setDoc(
    userAdminDocRef,
    { createdAt: getCurrentDate() },
    { merge: true }
  );

  const bondsRequestPath = collection(
    db,
    `${ADMIN_DASH_COLLECTION}/${uid}/${BONDS_REQUEST_SUB_COLLECTION}`
  );
  return addDoc(bondsRequestPath, {
    ...bondData,
    requestStatus: "Pending",
    typeOfRequest: typeOfRequest,
  });
}

export async function buyBonds(uid, bondData, typeOfRequest) {
  const userRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const userFullName = userData.fullName;

    const notificationData = {
      message: `User '${userFullName}' made a request to ${typeOfRequest} bonds`,
      timeStamp: new Date(),
    };
    await addDoc(
      collection(
        db,
        ADMINUSERS_COLLECTION,
        "notifications",
        "bondNotifications"
      ),
      notificationData
    );
    return sendRequestAdmin(uid, bondData, typeOfRequest);
  } else {
    console.error("User not found in Firestore.");
    return null;
  }
}

export async function sellBonds(uid, bondData) {
  const userRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const userFullName = userData.fullName;
    const notificationData = {
      message: `User '${userFullName}' made a request to sell bonds`,
      timeStamp: new Date(),
    };
    await addDoc(
      collection(
        db,
        ADMINUSERS_COLLECTION,
        "notifications",
        "bondNotifications"
      ),
      notificationData
    );

    return (
      // sendRequestToUser(uid, bondData, "sell"), // Assume you have a similar function for user
      sendRequestAdmin(uid, bondData, "sell")
    );
  } else {
    console.error("User not found in Firestore.");
    return null;
  }
}

// Function to delete a bond based on its currentValue
export async function deleteBond(uid, bondId) {
  try {
    const userBondsPath = `users/${uid}/bondsHoldings`;
    const bondDocRef = doc(db, userBondsPath, bondId);

    const bondDoc = await getDoc(bondDocRef);
    console.log("Bond doc:", bondDoc);
    if (bondDoc.exists()) {
      const bondData = bondDoc.data();
      console.log("Bond data:", bondData);
      if (bondData.currentValue <= 0) {
        // Delete the bond document as its currentValue is 0 or less
        console.log(bondData.currentValue <= 0);
        await deleteDoc(bondDocRef);
        console.log(`Bond with ID ${bondId} has been deleted.`);
      } else {
        console.log(
          `Bond with ID ${bondId} cannot be deleted as its currentValue is above 0.`
        );
        return;
      }
    } else {
      console.error(`Bond with ID ${bondId} does not exist.`);
    }
  } catch (error) {
    console.error(`Error deleting bond with ID ${bondId}:`, error);
  }
}
