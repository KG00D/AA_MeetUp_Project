import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./SignupModal.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (isModalOpen && !e.target.closest(".signupPageContainer")) {
        closeModal();
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isModalOpen]);

  const [email, setEmail] = useState("");
  const [emailInputState, setEmailInputState] = useState("default");

  const [username, setUsername] = useState("");
  const [usernameInputState, setUsernameInputState] = useState("default");

  const [firstName, setFirstName] = useState("");
  const [firstNameInputState, setFirstNameInputState] = useState("default");

  const [lastName, setLastName] = useState("");
  const [lastNameInputState, setLastNameInputState] = useState("default");

  const [password, setPassword] = useState("");
  const [passwordInputState, setPasswordInputState] = useState("default");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordInputState, setConfirmPasswordInputState] = useState(
    "default"
  );

  const [errors, setErrors] = useState([]);
  const [customErrors, setCustomErrors] = useState({
    usernameError: "",
    passwordError: "",
  });
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);

  const isFormIncomplete =
    !email ||
    email.length < 1 ||
    !username ||
    username.length < 4 ||
    !firstName ||
    !lastName ||
    !password ||
    password.length < 6 ||
    !confirmPassword;

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      setCustomErrors({
        usernameError: "",
        passwordError: "",
      });

      if (username.length < 4) {
        setCustomErrors({
          ...customErrors,
          usernameError: "Username must be at least 4 characters long",
        });
      }

      if (password.length < 6) {
        setCustomErrors({
          ...customErrors,
          passwordError: "Password must be at least 6 characters long",
        });
      }

      const response = await dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      );

      if (response.data && response.data.errors) {
        setErrors(response.data.errors);
      } else {
        setIsSignUpSuccess(true);
      }
    } else {
      setErrors([
        "Confirm Password field must be the same as the Password field",
      ]);
    }
  };

  if (sessionUser) {
    return <Redirect to="/" />;
  }

  if (isSignUpSuccess) {
    return (
      <div className="signupSuccessMessage">
        <h2>Sign up successful!</h2>
        <p>Your account has been created.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Render a "Sign Up" button elsewhere in your app */}
      {/* When you click the "Sign Up" button, set isModalOpen to true */}
      <button onClick={() => setIsModalOpen(true)}>Sign Up</button>

      {isModalOpen && (
        <div className="modalBackdrop" onClick={closeModal}>
          <div className="signupPageContainer" onClick={handleModalClick}>
            <h1>Sign Up</h1>
            {errors.length > 0 && (
              <div className="error-container">
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFirstNameInputState("filled");
                  }}
                  placeholder={
                    firstNameInputState === "default" ? "First Name" : ""
                  }
                  required
                  className={
                    firstNameInputState === "error"
                      ? "error"
                      : firstNameInputState
                  }
                />
              </label>
              {errors.firstName && <p>{errors.firstName}</p>}

              <label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setLastNameInputState("filled");
                  }}
                  placeholder={
                    lastNameInputState === "default" ? "Last Name" : ""
                  }
                  required
                  className={
                    lastNameInputState === "error" ? "error" : lastNameInputState
                  }
                />
              </label>
              {errors.lastName && <p>{errors.lastName}</p>}

              <label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailInputState("filled");
                  }}
                  placeholder={
                    emailInputState === "default" ? "Email" : ""
                  }
                  required
                  className={
                    emailInputState === "error" ? "error" : emailInputState
                  }
                />
              </label>
              {errors.email && <p>{errors.email}</p>}

              <label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameInputState("filled");
                  }}
                  placeholder={
                    usernameInputState === "default" ? "Username" : ""
                  }
                  required
                  className={
                    usernameInputState === "error"
                      ? "error"
                      : usernameInputState
                  }
                />
              </label>
              {errors.username && <p>{errors.username}</p>}

              <label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordInputState("filled");
                  }}
                  placeholder={
                    passwordInputState === "default" ? "Password" : ""
                  }
                  required
                  className={
                    passwordInputState === "error"
                      ? "error"
                      : passwordInputState
                  }
                />
              </label>
              {errors.password && <p>{errors.password}</p>}

              <label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordInputState("filled");
                  }}
                  placeholder={
                    confirmPasswordInputState === "default"
                      ? "Confirm Password"
                      : ""
                  }
                  required
                  className={
                    confirmPasswordInputState === "error"
                      ? "error"
                      : confirmPasswordInputState
                  }
                />
              </label>
              {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

              <button
                className="sign-up-btn"
                type="submit"
                disabled={isFormIncomplete}
                style={{
                  backgroundColor: isFormIncomplete ? "grey" : "",
                }}
              >
                Sign Up
              </button>
            </form>
            {customErrors.usernameError && (
              <p className="custom-error-message">
                {customErrors.usernameError}
              </p>
            )}
            {customErrors.passwordError && (
              <p className="custom-error-message">
                {customErrors.passwordError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupFormModal;
