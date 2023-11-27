import './login.css';
import '../theme.css';
import wallet from "./wallet.png";
import { Input } from "../../components/LoginComponents/Input";
import { useState } from 'react';
import { Link } from 'react-router-dom';


function LoginPage() {
 
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordFormatRegex = /^[A-Za-z0-9]+$/;

  return (
    <div className='screen'>
        <div className='page'>
            <div className='c'>
                <h1 className='logo'>
                    WalletWise
                </h1>
                    <img src={wallet} alt="Wallet Icon"/>
                <div className='login'>
                    <div className='pic'>
                        <div className='uploadpic'></div>
                        <h1 className='welcome'>Welcome Back! Please Login.</h1>
                    </div>
                    <div className='input'>
                        <Input
                        type="email"
                        placeholder={"first.last@mail.com"}
                        header="Email:"
                        value={email}
                        setter={setEmail}
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
              {(emailFormatRegex.test(email) && passwordFormatRegex.test(password)) ? (
                <Link to={`/dashboard`}>
                  <button type="button" className="next">
                    DONE
                  </button>
                </Link>
              ) : (
                <button type="button" className="next" disabled>
                  DONE
                </button>
              )}
            </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default LoginPage;
