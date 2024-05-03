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
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "./firebase";

const USERS_COLLECTION = "users";

//CASH DEPOSIT
const CASH_DEPOSIT_SUB_COLLECTION = "cashDeposits";
//get Cash Deposit
export async function getCashDeposit(uid) {
  const cashDepositQuery = query(
    collection(db, USERS_COLLECTION, uid, CASH_DEPOSIT_SUB_COLLECTION)
  );
  const querySnapshot = await getDocs(cashDepositQuery);

  if (querySnapshot.empty) {
    return null;
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}
