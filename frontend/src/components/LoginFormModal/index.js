import React, { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { useModal } from "../../context";
import './LoginFormModal.css';

function LoginFormModal({ onClose }) {
  
  const dispatch = useDispatch();  
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const history = useHistory();
  const { closeModal } = useModal();

  useEffect(() => {
    if (credential.length >= 4 && password.length >= 6) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }

    document.body.addEventListener("click", handleBodyClick);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, [credential, password]);

  const handleBodyClick = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      if (onClose) {
        onClose();
      }
    }
  };

  const handleDemoUser = (e) =>{
    e.preventDefault();
    return dispatch(sessionActions.login({ credential:'Demo-lition', password:'password' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: "The provided credentials were invalid." });
        }
      });
  }
  
  return (
    <div ref={formRef}>
      <form onSubmit={handleSubmit}>
        <h2 className="login-title">Log In</h2>

        {errors.credential && <p className="error-message">{errors.credential}</p>}
        {errors.general && <p className="error-message">{errors.general}</p>} 

        <label>
          <input
            className="login-form"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Username or Email"
            required
          />
        </label>
        <label>
          <input
            className="login-form"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>
        <button type="submit" className="submit-btn" disabled={isButtonDisabled}>Log In</button>
        <button type="submit" className="submit-btn" onClick={handleDemoUser}>Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;