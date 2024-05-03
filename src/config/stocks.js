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
    doc,
    getDoc,
    getDocs,
    updateDoc,
  } from "firebase/firestore";
  import { db } from "./firebase";
  
  const USERS_COLLECTION = "users";

//STOCKS
const STOCKS_COLLECTION = "stocks";
// Function to get stock data from the user's database
export async function getStock(userId) {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);

    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // Creating a reference to the stocks sub-collection of the user's document
      const stocksCollectionRef = collection(userDocRef, STOCKS_COLLECTION);
      const stocksSnapshot = await getDocs(stocksCollectionRef);

      const stocksData = stocksSnapshot.docs.map((doc) => doc.data());
      return stocksData;
    } else {
      console.error(`User with ID ${userId} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error getting stock from user database: ", error);
    throw error;
  }
}

// Function to update a single stock in Firestore
export const updateStockInDB = async (userId, stock) => {
  try {
    if (!stock.id) {
      throw new Error("Stock ID is missing or invalid");
    }
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const stocksCollectionRef = collection(userDocRef, STOCKS_COLLECTION);
      const stockRef = doc(stocksCollectionRef, stock.id);
      await updateDoc(stockRef, stock);
    } else {
      console.error(`Error processing Update.`);
      return null;
    }
  } catch (error) {
    console.error("Error updating stock in the database:", error);
  }
};
