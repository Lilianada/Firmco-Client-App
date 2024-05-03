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
  import { getCurrentDate } from "./utils"
  
  const USERS_COLLECTION = "users";
  const ADMIN_DASH_COLLECTION = "admin_users";
  const ADMINUSERS_COLLECTION = "adminUsers";

  //FIXED TERM DEPOSIT
const FIXED_TERM_SUB_COLLECTION = "fixedTermDeposit";
const FIXED_TERMS_SUB_COLLECTION = "fixedTermDeposits";
const TERM_REQUEST_COLLECTION = "termDepositRequest";

export async function getFixedTerm() {
  const fixedTermQuery = query(
    collection(db, FIXED_TERM_SUB_COLLECTION)
  );
  const querySnapshot = await getDocs(fixedTermQuery);

  if (querySnapshot.empty) {
    return null; 
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}

export async function getUserTerm(uid) {
  const fixedTermQuery = query(
    collection(db, USERS_COLLECTION, uid, FIXED_TERMS_SUB_COLLECTION)
  );
  const querySnapshot = await getDocs(fixedTermQuery);

  if (querySnapshot.empty) {
    return null; 
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}

export async function depositFixedTerm(uid, newDeposit) {
  try {
    const userAdminDocRef = doc(db, `${ADMIN_DASH_COLLECTION}/${uid}`);
    await setDoc(
      userAdminDocRef,
      { createdAt: getCurrentDate() },
      { merge: true }
    );

    const fixedTerm_RequestPath = collection(
      db,
      `${ADMIN_DASH_COLLECTION}/${uid}/${TERM_REQUEST_COLLECTION}`
    );

    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const userFullName = userData.fullName;
      const notificationData = {
        message: `User '${userFullName}' made a fixed term deposit request`,
        timeStamp: new Date(),
      };
      await addDoc(
        collection(
          db,
          ADMINUSERS_COLLECTION,
          "notifications",
          "termsNotifications"
        ),
        notificationData
      );
    } else {
      console.error("User not found in Firestore.");
    }

    return addDoc(fixedTerm_RequestPath, {
      ...newDeposit,
    });
  } catch (error) {
    console.error("Error during deposit request: ", error);
    throw error; // or handle the error as per your needs.
  }
}

export async function withdrawFixedTerm(uid, fixedTermdData) {
  try {
    const userAdminDocRef = doc(db, `${ADMIN_DASH_COLLECTION}/${uid}`);
    await setDoc(
      userAdminDocRef,
      { createdAt: getCurrentDate() },
      { merge: true }
    );

    const fixedTerm_RequestPath = collection(
      db,
      `${ADMIN_DASH_COLLECTION}/${uid}/${TERM_REQUEST_COLLECTION}`
    );

    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const userFullName = userData.fullName;
      const notificationData = {
        message: `User '${userFullName}' made a fixed term deposit withdrawal request`,
        timeStamp: new Date(),
      };
      await addDoc(
        collection(
          db,
          ADMINUSERS_COLLECTION,
          "notifications",
          "termsNotifications"
        ),
        notificationData
      );
    } else {
      console.error("User not found in Firestore.");
    }

    return addDoc(fixedTerm_RequestPath, {
      ...fixedTermdData,
    });
  } catch (error) {
    console.error("Error during withdrawal request: ", error);
    throw error; // or handle the error as per your needs.
  }
}
