import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./signup.css";
import "../theme.css";
import { Input } from "../../components/SignupComponents/Input";

export const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const logoOne = require("./wallet.png");

    const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameFormatRegex = /^[A-Za-z0-9_]+$/;
    const passwordFormatRegex = /^[A-Za-z0-9]+$/;
  

  return (
    <div className="screen">
      <div className="page">
        <div className="center">
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
              value={username}
              setter={setUsername}
            />
            <Input
              type="username"
              placeholder={"user_name"}
              header="Username:"
              value={name}
              setter={setName}
            />
            <Input
              type="password"
              placeholder={"password1234"}
              header="Password:"
              value={password}
              setter={setPassword}
            />
            </div>
            <div className="click">
              {(emailFormatRegex.test(username) && nameFormatRegex.test(name) && passwordFormatRegex.test(password)) ? (
                <Link to={`/setbudget`}>
                  <button type="button" className="next">
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
