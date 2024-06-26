import React, { useState } from "react";
import { storage } from "../config/firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import axios from "axios";
import Loader from "./Loader";

function NewPost({ newUploadMade }) {
  const [loading, setLoading] = useState(false);

  const parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(atob(base64));
  };

  const token = localStorage.getItem("token");
  const tokenDecoded = parseJwt(token);
  console.log("here is your decoded token: ", tokenDecoded);
  const authorId = tokenDecoded.id.id;
  console.log(authorId);

  const baseUrl = "http://localhost:3337";
  const [postModal, setPostModal] = useState(false);
  const handleModalOpen = () => {
    setPostModal(!postModal);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageUpload) {
      alert("Please select an image!");
      return;
    }
    setLoading(true);
    await uploadImage();
  };

  const handleDescriptionChange = (event) => {
    setImageDescription(event.target.value);
  };

  const [imageUpload, setImageUpload] = useState(null);
  const [imageDescription, setImageDescription] = useState("");
  const uploadImage = async () => {
    if (imageUpload == null) {
      alert("select an image!");
      return;
    }
    const userName = tokenDecoded.id.name;
    const imageRef = ref(
      storage,
      `users/${userName}/${imageUpload.name + v4()}`
    );
    try {
      await uploadBytes(imageRef, imageUpload);

      const imageUrl = await getDownloadURL(imageRef);
      console.log(imageUrl);
      const postData = {
        url: imageUrl,
        description: imageDescription,
        // alteração feita com sono de madrugada
        authorId: authorId,
      };
      const response = await axios.post(`${baseUrl}/post/create`, postData);
      if (response.status == 200) {
        console.log("Data sent to database!");
        setImageUpload(null);
        handleModalOpen();
        if (newUploadMade){
            newUploadMade();
        }
      }
    } catch (error) {
      console.error("Something went wrong!", error);
    } finally{
        setLoading(false);
    }
  };
  return (
    <div>
      <button
        onClick={handleModalOpen}
        className="text-slate-50 z-30 fixed top-0 left-0 font-medium text-center h-12 bg-transparent py-2 pl-3 transition-all ease-in hover:text-green-300"
      >
        + Create
      </button>
      {postModal && (
        <div className="modal text-slate-50 w-[400px] h-[320px] rounded flex flex-col gap-5 fixed inset-1 items-center justify-center mx-[auto] my-[auto] bg-gray-700">
          <div className="overlay w-[100vw] h-[100vh] top-0 left-0 right-0 bottom-0 fixed -z-10 bg-[rgba(49,49,49,0.8)]"></div>
          {!loading ? (
            <h2 className="text-3xl">Create a new design</h2>
          ) : (
            <h2 className="text-3xl">Creating a new design</h2>
          )}
          {!loading && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label>Select your files: </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setImageUpload(event.target.files[0]);
                }}
                name="image"
              />
              <input
                type="text"
                onChange={handleDescriptionChange}
                name="description"
                className="p-4 text-black"
                placeholder="Set a description (optional)"
              />

              <button className="bg-purple-600 transition-all ease-in hover:bg-purple-500">
                Create
              </button>
              <button onClick={handleModalOpen} className="text-gray-500">
                Dismiss
              </button>
            </form>
          )}

          {loading && <Loader />}
        </div>
      )}
    </div>
  );
}
export default NewPost;
