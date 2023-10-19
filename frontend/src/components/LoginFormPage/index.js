import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import './LoginFormPage.css';

function LoginFormPage({onClose}) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(true); 
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (credential.length >= 4 && password.length >= 6) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [credential, password]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
  
    return dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        if (onClose) {
          onClose(); 
        }
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors({ credential: data.errors[0] });
        } else {
          setErrors({ credential: "The provided credentials were invalid." });
        }
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="login-title">Log In</h2>
        
        {errors.credential && <p className="error-message">{errors.credential}</p>} 
        
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
      </form>
    </>
  );
}

export default LoginFormPage;