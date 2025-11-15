import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
        <div className="welcome-page">
            <div className="welcome-page__content">
                <div className="welcome-page__right">
                    <div className="login-form-container">
                        <div className="login-form__header">
                            <h1 className="login-form__title">Registracija korisnika</h1>
                            <p className="login-form__subtitle">Kreirajte novi nalog</p>
                        </div>

                        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label className="form-label">Korisničko ime</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    {...register("username", { required: "Korisničko ime je obavezno" })}
                                />
                                {errors.username && (
                                    <p className="error-message__text">{errors.username.message}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Lozinka</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    {...register("password", { required: "Lozinka je obavezna" })}
                                />
                                {errors.password && (
                                    <p className="error-message__text">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    {...register("email", {
                                        required: "Email je obavezan",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Unesite validan email",
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <p className="error-message__text">{errors.email.message}</p>
                                )}
                            </div>

                            <button type="submit" className="btn btn--primary btn--full-width">
                                Registruj se
                            </button>
                        </form>

                        <div className="login-form__footer">
                            <p className="footer-text">
                                Već imate nalog?{" "}
                                <Link to="/login" style={{ color: "#ea580c", textDecoration: "none", fontWeight: 600 }}>
                                    Prijavite se
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );
}