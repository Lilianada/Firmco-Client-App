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
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const USERS_COLLECTION = "users";
const BANKING_DETAILS_SUB_COLLECTION = "bankingDetails";


export async function manageBankingDetails(uid, formData, detailsId) {
  const bankingDetailsRef = collection(
    db,
    USERS_COLLECTION,
    uid,
    BANKING_DETAILS_SUB_COLLECTION
  );
  if (detailsId) {
    const updateBankingDetailsRef = collection(
      db,
      USERS_COLLECTION,
      uid,
      BANKING_DETAILS_SUB_COLLECTION,
    );
    const bankRef = doc(updateBankingDetailsRef, detailsId)
    try {
      await setDoc(bankRef, {
        accountName: formData.accountName,
        bankName: formData.bankName,
        branch: formData.branch,
        bsbNumber: formData.bsbNumber,
        accountNumber: formData.accountNumber,
        iban: formData.iban,
        swiftCode: formData.swiftCode,
      });
    } catch (error) {
      throw error;
    }
  } else {
    // No matching documents found, proceed to add a new document
    const dets = query(
      bankingDetailsRef,
      where("accountName", "==", formData.accountName),
      where("bankName", "==", formData.bankName),
      where("branch", "==", formData.branch),
      where("bsbNumber", "==", formData.bsbNumber),
      where("accountNumber", "==", formData.accountNumber),
      where("swiftCode", "==", formData.swiftCode)
    );

    // Execute the query to check for existing documents
    const querySnapshot = await getDocs(dets);
    if (querySnapshot.empty) {
      try {
        await addDoc(bankingDetailsRef, {
          accountName: formData.accountName,
          bankName: formData.bankName,
          branch: formData.branch,
          bsbNumber: formData.bsbNumber,
          accountNumber: formData.accountNumber,
          iban: formData.iban,
          swiftCode: formData.swiftCode,
        });
      } catch (error) {
        throw error;
      }
    }
  }
}

export async function getBankingDetails(uid) {
  const firestorePath = `users/${uid}/bankingDetails`;

  const bankingDetailsQuery = query(collection(db, firestorePath));
  const querySnapshot = await getDocs(bankingDetailsQuery);

  if (querySnapshot.empty) {
    return []; // Return an empty array if no banking details are found
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}
