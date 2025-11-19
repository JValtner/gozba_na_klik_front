import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateUser } from "../service/userService";
import { baseUrl } from "../../config/routeConfig";
import { useUser } from "./UserContext";
import Spinner from "../spinner/Spinner";

export default function UserProfile() {
  const navigate = useNavigate();
  const { role, user, isAuth, userId } = useUser();
  const [statusMsg, setStatusMsg] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { refreshUser } = useUser();
  // Fetch profile
  useEffect(() => {
      try {
        reset({
          userimage: user.userImage || null,
          username: user.username || "",
          email: user.email || "",
        });
      } catch (err) {
        setErrorMsg("Greška pri učitavanju profila");
        setTimeout(() => setStatusMsg(""), 3000);
      }
      finally {
        setLoading(false);
      }
  }, [isAuth, reset]);

  // Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (data.userimage?.[0]) {
        formData.append("userimage", data.userimage[0]);
      }
      formData.append("username", data.username);
      formData.append("email", data.email);

      await updateUser(user?.id, formData);
      setStatusMsg("Profil je uspešno ažuriran");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      setErrorMsg("Greška prilikom ažuriranja profila");
      setTimeout(() => setErrorMsg(""), 3000);
    }
    finally{
      setLoading(false);
      await refreshUser();
    }
  };

  const imageSrc = previewImage
    ? previewImage
    : user?.userImage
    ? `${baseUrl}${user.userImage}`
    : `${baseUrl}/assets/profileImg/default_profile.png`;

    if(loading || statusMsg!=="" || errorMsg!=="") return <Spinner/>
  return (
    

    <div className="user-profile-container">
      <h2>Profil korisnika</h2>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="statusMsg">{statusMsg}</div>

        <div className="profile-image">
          <img
            src={imageSrc}
            alt="Profile Preview"
            onError={(e) => {
              e.target.src = `${baseUrl}/assets/profileImg/default_profile.png`;
            }}
          />
          <input type="file" {...register("userimage")} onChange={handleImageChange} />
        </div>

        <div>
          <label>Korisničko ime</label>
          <input type="text" disabled {...register("username")} />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email je obavezan",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Unesite validan email",
              },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <button type="submit">Sačuvaj izmene</button>
      </form>

      {isAuth && role === "User" && (
        <div className="alergens-section-container">
          <div className="alergens-title-container">
            <h2>Moji alergeni 🥜</h2>
            <button
              className="btn btn--primary"
              onClick={() => navigate("/profile/alergens")}
            >
              Izmeni
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
