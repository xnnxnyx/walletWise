import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./signup.css";
import "../theme.css";
import '../LogOrSign/logorsign.css';
import { Input } from "../../components/SignupComponents/Input";
import { signup } from '../../api.mjs'; 


export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const wallet = require("./wallet.png");

    const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameFormatRegex = /^[A-Za-z0-9_]+$/;
    const passwordFormatRegex = /^[A-Za-z0-9]+$/;
    const [loginError, setLoginError] = useState(null);


    const handleSignUp = async (e) => {
      e.preventDefault();
      signup(username, password, email, (error, response) => {
        if (error) {
            setLoginError("Error occurred during signup. Please try again."); // or handle the error in a way that makes sense for your application
        } else if (response.status === 409) {
            setLoginError("Invalid username or password. Please try again.");
        } else if (response.status === 500) {
            setLoginError("Internal Server Error. Please try again.");
        } else {
            navigate('/dashboard');
        }
    });
    
    };
    
  return (
    <div className="screen">
      <div className="page">
        <div className="c">
          <div className="combine">
          <h1 className='logo'>
                    WalletWise
                </h1>
                <img className='img' src={wallet} alt="Wallet Icon"/>
          </div>
          <div className="login">
            <div className='input'>
            <Input
              type="email"
              placeholder={"first.last@mail.com"}
              header="Email:"
              value={email}
              setter={(value) => {
                setEmail(value);
                setIsEmailValid(emailFormatRegex.test(value));
              }}
              isValid={isEmailValid}
              errorMessage="Please enter a valid email address."
            />
            <Input
              type="username"
              placeholder={"user_name"}
              header="Username:"
              value={username}
              setter={(value) => {
                setUsername(value);
                setIsUsernameValid(nameFormatRegex.test(value));
              }}
              isValid={isUsernameValid}
              errorMessage="Username can only contain letters, numbers, and underscores."
            />
            <Input
              type="password"
              placeholder={"password1234"}
              header="Password:"
              value={password}
              setter={(value) => {
                setPassword(value);
                setIsPasswordValid(passwordFormatRegex.test(value));
              }}
              isValid={isPasswordValid}
              errorMessage="Password can only contain letters and numbers."
            />
            </div>
            <div className="click">
              {(emailFormatRegex.test(email) && nameFormatRegex.test(username) && passwordFormatRegex.test(password)) ? (
                  <button type="button" className="next" onClick={handleSignUp} >
                    NEXT
                  </button>
              ) : (
                <button type="button" className="next">
                NEXT
              </button>
              )}
            </div>
            <div className='error'>
                    {loginError && <div className="error-message">{loginError}</div>}
                  </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
