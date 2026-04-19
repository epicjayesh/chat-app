import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const navigate = useNavigate();

  if (!authUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedData = {
      fullName: name,
      bio,
    };

    if (selectedImg) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);

      reader.onload = async () => {
        await updateProfile({
          ...updatedData,
          profilePic: reader.result,
        });
        navigate("/");
      };
    } else {
      await updateProfile(updatedData);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile Details</h3>

          {/* IMAGE */}
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept="image/*"
              hidden
            />

            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt="profile"
              className="w-12 h-12 rounded-full"
            />

            <span>Upload profile image</span>
          </label>

          {/* NAME */}
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your Name"
            className="p-2 border border-gray-500 rounded-md outline-none"
          />

          {/* BIO */}
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            required
            rows={4}
            placeholder="Write profile bio"
            className="p-2 border border-gray-500 rounded-md outline-none"
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full"
          >
            Save
          </button>
        </form>

        {/* PREVIEW */}
        <img
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
          src={authUser?.profilePic || assets.logo_icon}
          alt="preview"
        />
      </div>
    </div>
  );
};

export default ProfilePage;