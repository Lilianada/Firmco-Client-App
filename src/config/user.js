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
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";

// const USER_COLLECTION = "users";
const USERS_COLLECTION = "users";

// Authenticated user
export function getAuthUser() {
  const authInstance = getAuth();
  const user = authInstance.currentUser;

  if (!user) {
    return;
  }
  const authUser = user.uid;
  return authUser;
}

export async function getUserName() {
  const userId = getAuthUser();
  const userDocRef = doc(db, "users", userId);
  let userName = "Unknown User";

  try {
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userDetails = userDocSnapshot.data();
      userName = userDetails.fullName;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
  return userName;
}

export async function getUser(uid) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return [{ ...userSnap.data(), id: userSnap.id }];
  } else {
    return [];
  }
}

export function updateUser(uid, userData) {
  const userDoc = doc(db, USERS_COLLECTION, uid);
  return updateDoc(userDoc, userData);
}

export function deleteUser(uid) {
  const userDoc = doc(db, USERS_COLLECTION, uid);
  return deleteDoc(userDoc);
}

//fetch user kyc
const KYC_DOC_ID = "kycDoc";
export async function getUserKyc(userId) {
  const kycRef = collection(db, USERS_COLLECTION, userId, KYC_DOC_ID);
  const kycSnapshot = await getDocs(kycRef);

  const kycData = kycSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  // If there's no kyc at all, return null
  if (kycData.length === 0) {
    return null;
  }
  return kycData ? kycData[0] : null;
}

// Update or create user KYC document
export async function updateUserKyc(userId, kycData) {
  try {
    const kycCollectionRef = collection(
      db,
      USERS_COLLECTION,
      userId,
      KYC_DOC_ID
    );
    const kycDocRef = doc(kycCollectionRef, "kyc_document");
    await setDoc(kycDocRef, kycData, { merge: true });
    return { success: true, id: KYC_DOC_ID };
  } catch (error) {
    console.error("Error updating kyc:", error);
    return { success: false, error: error.message }; // Return error message on failure
  }
}


export async function getUserKycCompletion(userId) {
  const kycDocRef = doc(db, USERS_COLLECTION, userId, KYC_DOC_ID, 'kyc_document');
  const kycSnapshot = await getDoc(kycDocRef);

  if (!kycSnapshot.exists()) {
    return 0; // No KYC data found
  }

  const kycData = kycSnapshot.data();
  const keys = Object.keys(kycData);
  const totalFields = keys.length; // Dynamically count fields
  let filledFields = 0;

  keys.forEach((key) => {
    const value = kycData[key];
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        filledFields += value.length > 0 ? 1 : 0;
      } else if (typeof value === 'string') {
        filledFields += value.trim() !== "" && value.toLowerCase() !== "nil" ? 1 : 0;
      } else {
        filledFields += 1; // Consider non-string and non-array types as filled if they are not null
      }
    }
  });

  const completionPercentage = Math.round((filledFields / totalFields) * 100);
  console.log(completionPercentage)
  return completionPercentage;
}
