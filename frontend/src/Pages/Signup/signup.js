import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./signup.css";
import "../theme.css";
import '../LogOrSign/logorsign.css';
import { Input } from "../../components/SignupComponents/Input";
import Axios from 'axios'; // Import Axios for making HTTP requests


export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const logoOne = require("./wallet.png");

    const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameFormatRegex = /^[A-Za-z0-9_]+$/;
    const passwordFormatRegex = /^[A-Za-z0-9]+$/;
    // const handleSignUp = async () => {
    //   try {
    //     // Make a POST request to your backend endpoint
    //     const response = await Axios.post('http://localhost:3000/signup/', {
    //       email,
    //       username,
    //       password,
    //       monthly_income: 0, // You may adjust this based on your requirements
    //       picture: "",
    //       join_id: null
    //     });

    //     // Handle the response as needed, e.g., redirect to the next page
    //     if (response.status === 200) {
    //       window.location.href = '/setbudget';
    //     }
    //   } catch (error) {
    //     console.error("Error during signup:", error);
    //     // Handle error, e.g., show an error message to the user
    //   }
    // };

  return (
    <div className="screen">
      <div className="page">
        <div className="c">
        <h1 className='logo'>
                    WalletWise
                </h1>
                    <img src={logoOne} alt="Wallet Icon" height={50} width={70}/>
          <div className="login">
            <div className="pic">
              <div className="uploadpic"></div>
              <h1 className="addpic">
                Add a profile picture!
              </h1>
            </div>
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
                <Link to={`/setbudget`}>
                  <button type="button" className="next" /*onClick={handleSignUp}*/>
                    NEXT
                  </button>
                </Link>
              ) : (
                <button type="button" className="next" disabled>
                  NEXT
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
