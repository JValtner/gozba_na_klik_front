import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getUserById, updateUser } from "../service/userService";
import { baseUrl } from "../../config/routeConfig";

export default function UserProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          const existingUser = await getUserById(Number(id));
          if (!existingUser) return;
          setUser(existingUser);

          // prefill form (except password)
          reset({
            userimage: null,
            username: existingUser.username || "",
            email: existingUser.email || "",
            password: "",
          });
        } catch (err) {
          setStatusMsg("Greška pri učitavanju korisnika");
          setTimeout(() => setStatusMsg(""), 3000);
        }
      }
    };

    fetchUser();
  }, [id, reset]);

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
      const formData = new FormData();

      if (data.userimage?.[0]) {
        formData.append("userimage", data.userimage[0]);
      }
      formData.append("username", data.username);
      formData.append("email", data.email);

      if (data.password) {
        formData.append("password", data.password);
      }

      await updateUser(Number(id), formData);

      alert("Profil je uspešno ažuriran!");
      navigate("/");
    } catch (err) {
      setStatusMsg("Greška prilikom ažuriranja profila");
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  // ✅ Determine which image to show: preview (if selected) or current profile image
  const imageSrc = previewImage
    ? previewImage
    : user?.userImage
    ? `${baseUrl}${user.userImage}`
    : `${baseUrl}/assets/profileImg/default_profile.png`;

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
          <input
            type="file"
            {...register("userimage")}
            onChange={handleImageChange}
          />
        </div>

        <div>
          <label>Korisničko ime</label>
          <input
            type="text"
            disabled
            {...register("username", {
              required: "Korisničko ime je obavezno",
            })}
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <div>
          <label>Lozinka (ostavite prazno ako ne menjate)</label>
          <input type="password" {...register("password")} />
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
    </div>
  );
}
