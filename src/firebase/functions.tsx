import { db, storage } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const insertDb = async (data: any, collectionName: string) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const uploadImage = (
  posterImage: any,
  collectionName: string,
  organisation: any
) => {
  // Convert the base64 string to binary data (Uint8Array)
  const binaryData = atob(posterImage.split(",")[1]);
  const length = binaryData.length;
  const uint8Array = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }
  const storageRef = ref(storage, `/${collectionName}/${organisation}.png`);

  // Create a metadata object with the content type set to image/png
  const metadata = {
    contentType: "image/png",
  };

  const uploadTask = uploadBytesResumable(storageRef, uint8Array, metadata);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const percent = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      console.log(`Upload is ${percent}% done`);
    },
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        console.log(url);
      });
    }
  );
};
