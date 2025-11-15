import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { register as registerService } from "../service/userService";

export default function RegisterUserForm() {
  const navigate = useNavigate();
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      await registerService({
        username: data.username,
        password: data.password,
        email: data.email,
      });

      setStatusMsg("Uspešno ste se registrovali!");
      // redirect after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Greška pri registraciji. Pokušajte ponovo.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
      setErrorMsg("");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Registracija korisnika</h2>

      {/* Status and error messages */}
      {statusMsg && (
        <div style={{ color: "green", marginBottom: "10px" }}>{statusMsg}</div>
      )}
      {errorMsg && (
        <div style={{ color: "red", marginBottom: "10px" }}>{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Korisničko ime</label>
          <input
            type="text"
            {...register("username", { required: "Korisničko ime je obavezno" })}
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email.message}</p>
          )}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registracija..." : "Registruj se"}
        </button>
      </form>
    </div>
  );
}