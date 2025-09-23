import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUser } from "../service/userService";
import { useUser } from "../users/UserContext";

export default function RegisterUserForm() {
    const navigate = useNavigate();
    const { setUsername } = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await createUser({
                ...data,
                username: data.username,
                password: data.password,
                email: data.email,
                role: "Buyer",
            });

            alert("Uspešno ste se registrovali!");
            navigate("/");
        } catch (err) {
            alert("Greška pri registraciji. Pokušajte ponovo.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto" }}>
            <h2>Registracija korisnika</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
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
