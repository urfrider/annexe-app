import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../firebase/firebaseConfig";

export const fetchData = async (collectionName : string) => {
  const snapshot = await getDocs(collection(db, collectionName));
  const list = snapshot.docs.map(async (doc) => {
    const data = doc.data();
    const posterUrl = await getDownloadURL(ref(storage, data.posterImage)); // get poster URL
    return {
      id: doc.id,
      ...data,
      posterUrl,
    };
  });
  const results = await Promise.all(list); // wait for all the URLs to resolve
  return results;
};
