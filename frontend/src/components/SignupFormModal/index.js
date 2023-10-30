import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context";
import './SignupFormModal.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const sessionState = useSelector((state) => state.session);

  useEffect(() => {
    console.log("Current session state:", sessionState);
  }, [sessionState]); 

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
  const [confirmPasswordInputState, setConfirmPasswordInputState] = useState("default");
  
  const [errors, setErrors] = useState([]);
  const [isButtonDisabled, setButtonDisabled] = useState(true);

  const { closeModal } = useModal();

  useEffect(() => {
    if (
      email.length > 0 &&
      username.length >= 4 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      password.length >= 6 &&
      confirmPassword.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email, username, firstName, lastName, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = [];

    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.push("Please provide a proper email");
    }
    
    if (password !== confirmPassword) {
      newErrors.push("Confirm Password field must be the same as the Password field");
    }
    if (username.length < 4) {
      newErrors.push("Username must be at least 4 characters long");
    }
    if (password.length < 6) {
      newErrors.push("Password must be at least 6 characters long");
    }

    if (newErrors.length === 0) {
      dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(() => {
          // console.log('Sign up successful!');
          // console.log("Session state after signup:", sessionState);
          closeModal();
        })
        .catch(async (res) => {
          const data = await res.json();
          // console.log("Signup failed:", data);
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="signup-form-container">
      <div className="signup-form-sub-container">
        <div className="signup-header">
          <h2 className="signup-title">Sign up</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <ul className='signup-errors-labels'>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
                    
          <label className='login-labels'>
            <input className={`login-inputs ${firstNameInputState}`}
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setFirstNameInputState(e.target.value ? "filled" : "default");
              }}
              placeholder={firstNameInputState === "default" ? "First Name" : ""}
              required
            />
          </label>

          <label className='login-labels'>
            <input className={`login-inputs ${lastNameInputState}`}
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setLastNameInputState(e.target.value ? "filled" : "default");
              }}
              placeholder={lastNameInputState === "default" ? "Last Name" : ""}
              required
            />
          </label>

          <label className='login-labels'>
            <input className={`login-inputs ${emailInputState}`}
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailInputState(e.target.value ? "filled" : "default");
              }}
              placeholder={emailInputState === "default" ? "Email" : ""}
              required
            />
          </label>

          <label className='login-labels'>
            <input className={`login-inputs ${usernameInputState}`}
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameInputState(e.target.value ? "filled" : "default");
              }}
              placeholder={usernameInputState === "default" ? "Username" : ""}
              required
            />
          </label>

          <label className='login-labels'>
            <input className={`login-inputs ${passwordInputState}`}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordInputState(e.target.value ? "filled" : "default");
              }}
              placeholder={passwordInputState === "default" ? "Password" : ""}
              required
            />
          </label>

          <label className='login-labels'>
            <input className={`login-inputs ${confirmPasswordInputState}`}
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordInputState(e.target.value ? "filled" : "default");
              }}
              placeholder={confirmPasswordInputState === "default" ? "Confirm Password" : ""}
              required
            />
          </label>

          <div className="login-btns-container">
            <button className="sign-up-btn" type="submit" disabled={isButtonDisabled}>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupFormModal;