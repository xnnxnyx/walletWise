import './login.css';
import '../theme.css';
import { Link } from 'react-router-dom';
import wallet from "./wallet.png";
import { Input } from "../../components/LoginComponents/Input";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signin } from '../../api.mjs';
import { getUsername } from '../../api.mjs';


function LoginPage() {
 
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const usernameFormatRegex = /^[A-Za-z0-9_]+$/;
const passwordFormatRegex = /^[A-Za-z0-9]+$/;

const [isUsernameValid, setIsUsernameValid] = useState(true);
const [isPasswordValid, setIsPasswordValid] = useState(true);

const [loginError, setLoginError] = useState(null);

const navigate = useNavigate();

const handleLogIn = async (e) => {
  e.preventDefault();
  try {
    const result = await signin(username, password);
    if (result.status === 401) {
      setLoginError("Invalid username or password. Please try again.");
  
    } else if (result.status === 401){
      setLoginError("Internal Server Error. Please try again.");
    } else {
      navigate('/dashboard');
      let user = getUsername();
    }
  } catch (error) {
    setLoginError("Login failed. Please check your credentials and try again.");
  }
};

  return (
    <div className='screen'>
        <div className='page'>
            <div className='c'>
            <h1 className='logo'>
                    WalletWise
                </h1>
              <div className='l'>
                <img className='img' src={wallet} alt="Wallet Icon"/>
              </div>
                <div className='login'>
                    <div className='pic'>
                        {/* <div className='uploadpic'></div> */}
                        <h1 className='welcome'>Welcome Back! Please Login.</h1>
                    </div>
                    <div className='input'>
                        <Input
                          type="username"
                          placeholder={"user_name"}
                          header="Username:"
                          value={username}
                          setter={(value) => {
                            setUsername(value);
                            setIsUsernameValid(usernameFormatRegex.test(value));
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
                    <div className="option">
                      <Link to={`/signup`}>
                      <p>Don't have an account? Sign Up now!</p>
                      </Link>
                    </div>
                    <div className="click">
                  {usernameFormatRegex.test(username) && passwordFormatRegex.test(password) ? (
                    <button type="button" className="next" onClick={handleLogIn}>
                      DONE
                    </button>
                  ) : (
                    <button type="button" className="next" disabled>
                      DONE
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
}

export default LoginPage;