import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { getUserById, updateUser } from "../service/userService";

export default function RegisterUserForm() {
    const navigate = useNavigate();
    const { user, setUser } = useState();
    const userId = localStorage.getItem("userId");
    const{statusMsg, setStatusMsg} = useState("");

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

 useEffect(() => {
    const fetchUser = async () => {
        if (userId) {
            try {
                const existingUser = await getUserById(Number(userId));
                setUser(user);
                setValue("userimage", existingUser.userimage);
                setValue("username", existingUser.username);
                setValue("password", existingUser.password);
                setValue("email", existingUser.email);
            } catch (err) {
                setTimeout(() => {setStatusMsg("User loading error");}, 3000);
                setStatusMsg("");
            }
        }
    };

    fetchUser();
}, [userId, setUser, setValue]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("userimage", data.userimage[0]); // first file
            formData.append("username", data.username);
            formData.append("password", data.password);
            formData.append("email", data.email);
            formData.append("role", "Buyer");

            await updateUser(Number(user.id), formData); // backend saves file to /uploads and stores path in DB

            alert("Uspešno ste se registrovali!");
            navigate("/");
        } catch (err) {
            setTimeout(() => {setStatusMsg("User update error");}, 3000);
                setStatusMsg("");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto" }}>
            <h2>Profile Page</h2>

            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div clasName="statusMsg" id="statusMsg">{statusMsg}</div>    
                <div>
                    <label>Profile image</label>
                    <input
                        type="file"
                        {...register("userimage", { required: "Profile image is required" })}
                    />
                    {errors.userimage && (
                        <p style={{ color: "red" }}>{errors.userimage.message}</p>
                    )}
                </div>

                <div>
                    <label>Korisničko ime</label>
                    <input
                        type="text"
                        {...register("username", { required: "Korisničko ime je obavezno" })}
                    />
                    {errors.username && (
                        <p style={{ color: "red" }}>{errors.username.message}</p>
                    )}
                </div>

                <div>
                    <label>Lozinka</label>
                    <input
                        type="password"
                        {...register("password", { required: "Lozinka je obavezna" })}
                    />
                    {errors.password && (
                        <p style={{ color: "red" }}>{errors.password.message}</p>
                    )}
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
                    {errors.email && (
                        <p style={{ color: "red" }}>{errors.email.message}</p>
                    )}
                </div>

                <button type="submit">Registruj se</button>
            </form>
        </div>
    );
}