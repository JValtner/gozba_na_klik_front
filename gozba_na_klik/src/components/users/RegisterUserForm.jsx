import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UseStrong, getPasswordStrength, register as registerService } from "../service/userService";
import Spinner from "../spinner/Spinner";

export default function RegisterUserForm() {
    const navigate = useNavigate();
    const [statusMsg, setStatusMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [strongPassword, setStrongPassword] = useState(UseStrong(10));
    const [strength, setStrength] = useState(0);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const generatePassword = async () => {
            const pwd = await UseStrong(10);
            setStrongPassword(pwd);
            setValue("password", pwd);
        };
        generatePassword();
    }, [setValue]);

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


            setStatusMsg("Uspešno ste se registrovali!Link za confirmaciju je poslat na vaš email.");
            // redirect after 2 seconds
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                "Greška pri registraciji. Pokušajte ponovo.";
            setErrorMsg(msg);
            setTimeout(() => setErrorMsg(""), 3000);
        } finally {
            setIsLoading(false);
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
                        {isLoading && <Spinner />}
                        <div className="status-messages">
                            {isLoading && <Spinner />}
                            {statusMsg && <p className="status-message__text">{statusMsg}</p>}
                            {errorMsg && <p className="error-message__text">{errorMsg}</p>}
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
                                    type={showPassword ? "text" : "password"}
                                    className="form-input"
                                    {...register("password", {
                                        required: "Lozinka je obavezna",
                                        minLength: {
                                            value: 10,
                                            message: "Lozinka mora imati najmanje 10 karaktera",
                                        },
                                        validate: {
                                            hasUppercase: (value) =>
                                                /[A-Z]/.test(value) || "Lozinka mora sadržati barem jedno veliko slovo",
                                            hasNumber: (value) =>
                                                /\d/.test(value) || "Lozinka mora sadržati barem jedan broj",
                                            hasSpecial: (value) =>
                                                /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                                                "Lozinka mora sadržati barem jedan specijalni znak",
                                        },
                                    })}
                                    defaultValue={strongPassword}
                                    onChange={(e) => setStrength(getPasswordStrength(e.target.value))}
                                />

                                {/* Strength meter */}
                                <div className="password-strength">
                                    <div className="password-strength__bar">
                                        <div
                                            className={`password-strength__bar-fill ${strength < 2
                                                    ? "password-strength__bar-fill--weak"
                                                    : strength < 3
                                                        ? "password-strength__bar-fill--medium"
                                                        : "password-strength__bar-fill--strong"
                                                }`}
                                            style={{ width: `${(strength / 4) * 100}%` }}
                                        />
                                    </div>
                                    <small
                                        className={`password-strength__label ${strength < 2
                                                ? "password-strength__label--weak"
                                                : strength < 3
                                                    ? "password-strength__label--medium"
                                                    : "password-strength__label--strong"
                                            }`}
                                    >
                                        {strength === 0 && "Slaba"}
                                        {strength === 1 && "Slaba"}
                                        {strength === 2 && "Srednja"}
                                        {strength === 3 && "Dobra"}
                                        {strength === 4 && "Odlična"}
                                    </small>
                                </div>

                                <button
                                    type="button"
                                    className="show-password-btn"
                                    onMouseDown={() => setShowPassword(true)}
                                    onMouseUp={() => setShowPassword(false)}
                                    onMouseLeave={() => setShowPassword(false)}
                                >
                                    👁
                                </button>

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