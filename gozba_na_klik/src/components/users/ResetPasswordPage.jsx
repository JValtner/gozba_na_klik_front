import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Spinner from "../spinner/Spinner";
import { resetPassword, getPasswordStrength } from "../service/userService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!userId || !token) {
      setErrorMsg("Nedostaje token ili korisnički ID.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setErrorMsg("Lozinke se ne poklapaju.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      await resetPassword({
        userId,
        token,
        newPassword: data.password,
      });

      setStatusMsg("Lozinka je uspešno promenjena.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      const msg =
        error.response?.data?.message || "Greška prilikom promene lozinke.";
      setErrorMsg(msg);
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
              <h1 className="login-form__title">Reset lozinke</h1>
              <p className="login-form__subtitle">Unesite novu lozinku</p>
            </div>

            {isLoading && <Spinner />}

            <div className="status-messages">
              {statusMsg && <p className="status-message__text">{statusMsg}</p>}
              {errorMsg && <p className="error-message__text">{errorMsg}</p>}
            </div>

            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label className="form-label">Nova lozinka</label>
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
                        /[A-Z]/.test(value) ||
                        "Lozinka mora sadržati barem jedno veliko slovo",
                      hasNumber: (value) =>
                        /\d/.test(value) ||
                        "Lozinka mora sadržati barem jedan broj",
                      hasSpecial: (value) =>
                        /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                        "Lozinka mora sadržati barem jedan specijalni znak",
                    },
                  })}
                  onChange={(e) => setStrength(getPasswordStrength(e.target.value))}
                />

                <div className="password-strength">
                  <div className="password-strength__bar">
                    <div
                      className={`password-strength__bar-fill ${
                        strength < 2
                          ? "password-strength__bar-fill--weak"
                          : strength < 3
                          ? "password-strength__bar-fill--medium"
                          : "password-strength__bar-fill--strong"
                      }`}
                      style={{ width: `${(strength / 4) * 100}%` }}
                    />
                  </div>
                  <small
                    className={`password-strength__label ${
                      strength < 2
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
                <label className="form-label">Potvrdi lozinku</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  {...register("confirmPassword", {
                    required: "Potvrda lozinke je obavezna",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="error-message__text">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn--secondary btn--full-width"
                disabled={isLoading}
              >
                Promeni lozinku
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}