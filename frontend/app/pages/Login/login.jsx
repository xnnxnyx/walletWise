import React from 'react';
import './login.css';
import wallet from "./wallet.png";

function LoginPage() {
  const handleNextClick = () => {
    console.log("Next button clicked!");
  };

  return (
    <div className='screen'>
        <div className='page'>
            <div className='center'>
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
                        <h1 className='content'>Email:</h1>
                        <div className='email'>
                        <input type="email" className='email' placeholder="first.last@mail.com" />
                        </div>
                        <h1 className='content'>Password:</h1>
                        <div className='password'>
                        <input type="password" className='password' placeholder="password1234" />
                        </div>
                    </div>
                    <div className='click'>
                    <button type="button" className="next" onClick={handleNextClick}>
                        NEXT
                    </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default LoginPage;
