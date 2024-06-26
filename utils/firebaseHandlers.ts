import { db } from "@/store/firebase";
import { doc, setDoc } from "firebase/firestore";

export const uploadToDatabase = (url: string) => {
  let docData = {
    mostRecentUploadURL: url,
    username: "jasondubon",
  };
  const userRef = doc(db, "users", docData.username);
  setDoc(userRef, docData, { merge: true })
    .then(() => {
      console.log("successfully updated DB");
    })
    .catch((error) => {
      console.log("error: ", error);
    });
};
