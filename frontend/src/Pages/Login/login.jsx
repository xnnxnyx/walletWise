import './login.css';
import '../theme.css';
import wallet from "./wallet.png";
import { Input } from "../../components/LoginComponents/Input";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../../api.mjs'; 


function LoginPage() {
 
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState(null);
const [isSigningUp, setIsSigningUp] = useState(false);


const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordFormatRegex = /^[A-Za-z0-9]+$/;

const handleSignup = async () => {
  console.log("I AM DONE");
  try {
    setIsSigningUp(true);

    if (emailFormatRegex.test(email) && passwordFormatRegex.test(password)) {
      await signup(email, password, (response) => {
        // Handle the response from the signup function
        if (response.success) {
          // Successful signup, you might want to handle this accordingly (e.g., redirect to dashboard)
          console.log('Signup successful!');
        } else {
          setError(response.message); // assuming your signup function returns an error message
        }
      });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    setError('An unexpected error occurred. Please try again.'); // handle unexpected errors
  } finally {
    setIsSigningUp(false);
  }
};

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
                    {/* here */}
                    <div className="click">
                      {(emailFormatRegex.test(email) && passwordFormatRegex.test(password)) ? (
                        <button
                          type="button"
                          className="next"
                          onClick={handleSignup}
                          disabled={isSigningUp}
                        >
                          {isSigningUp ? 'Signing Up...' : 'DONE'}
                        </button>
                      ) : (
                        <button type="button" className="next" disabled>
                          DONE
                        </button>
                      )}
                      {error && <div className="error-message">{error}</div>}
                    </div>
                    {/* to here */}
                </div>
            </div>
        </div>
    </div>
  );
}

export default LoginPage;


{/* <div className="click">
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
                    </div> */}