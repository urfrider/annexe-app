import { db, storage } from "./firebaseConfig";
import { collection, addDoc,doc, updateDoc,deleteDoc  } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const insertDb = async (data: any, collectionName: string) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const updateDb = async (collectionName: string, docId: string, updatedData: any) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updatedData);
    console.log("Document updated successfully!");
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

export const deleteDb = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log("Document deleted successfully!");
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

export const uploadImage = async (
  posterImage: any,
  collectionName: string,
  organisation: any,
  data: any
) => {
  // Convert the base64 string to binary data (Uint8Array)
  posterImage.forEach ((image: string) => {
    const binaryData = atob(image.split(",")[1]);
    const length = binaryData.length;
    const uint8Array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    var metadata;
    var fileExtension;

    if(image.includes("mp4")){
       metadata = {
        contentType: "video/mp4",
      };
      fileExtension = "mp4";
    }else if (image.includes("png")) {
       metadata = {
        contentType: "image/png",
      };
      fileExtension = "png";
    }else {
       metadata = {
        contentType: "image/jpg",
      };
      fileExtension = "jpg";
    }

    const randomNumber = Math.floor(Math.random() * 10000) + 1;
    const fileName = `${organisation}_${randomNumber}.${fileExtension}`;
    
    const storageRef = ref(storage, `/${collectionName}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, uint8Array, metadata);

    data.posterImage.push(`/${collectionName}/${fileName}`); //to add to posterImage array
  
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
  })

  await insertDb(data, collectionName);
};
