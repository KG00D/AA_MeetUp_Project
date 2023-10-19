import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./SignupModal.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <div className="signupPageContainer">
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
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}

        <label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}

        <label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}

        <label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </label>
        {errors.username && <p>{errors.username}</p>}

        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}

        <label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

        <button
          className="sign-up-btn"
          type="submit"
          disabled={isFormIncomplete}
          style={{ backgroundColor: isFormIncomplete ? "grey" : "" }}
        >
          Sign Up
        </button>
      </form>
      {customErrors.usernameError && (
        <p className="custom-error-message">{customErrors.usernameError}</p>
      )}
      {customErrors.passwordError && (
        <p className="custom-error-message">{customErrors.passwordError}</p>
      )}
    </div>
  );
}

export default SignupFormModal;
