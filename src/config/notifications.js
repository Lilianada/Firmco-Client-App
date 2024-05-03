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
    getDocs,
  } from "firebase/firestore";
  import { db } from "./firebase";

  const USERS_COLLECTION = "users";
  

//NOTIFICATIONS
const NOTIFICATIONS_SUB_COLLECTION = "notifications";

export async function getNotifications(userId) {
  try {
    const notificationsRef = collection(
      db,
      USERS_COLLECTION,
      userId,
      NOTIFICATIONS_SUB_COLLECTION
    );
    const notificationsSnapshot = await getDocs(notificationsRef);

    if (!notificationsSnapshot || notificationsSnapshot.empty) {
      return [];
    }

    const notifications = notificationsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
}

export const deleteNotification = async (uid, notificationId) => {
  console.log(uid, notificationId)
  try {
    const requestRef = doc(
      db,
      USERS_COLLECTION,
      uid,
      NOTIFICATIONS_SUB_COLLECTION,
      notificationId
    );
    await deleteDoc(requestRef);
  } catch (error) {
    console.error("Error deleting Notification: ", error);
    throw error;
  }
};

export const deleteAllNotification = async (uid) => {
  const notificationsRef = collection(db, 'users', uid, 'notifications');

  const deleteCollection = async (collectionRef) => {
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };
  try {
    await deleteCollection(notificationsRef);
    console.log('All notifications deleted successfully');
  } catch (error) {
    console.error("Error deleting notifications: ", error);
    throw error;
  }
};
