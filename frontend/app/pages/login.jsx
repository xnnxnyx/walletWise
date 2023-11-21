import React from 'react';
import './login.css';

function LoginPage() {
  const handleNextClick = () => {
    console.log("Next button clicked!");
  };

  return (
    <div className='screen'>
        <div className='page'>
            <div className='center'>
                <div className='login'>
                    <div className='pic'>
                        <div className='uploadpic'>
                        </div>
                        <h1 className='addpic'>
                            Add your Profile Picture!
                        </h1>
                    </div>
                    <div className='input'>
                        <h1 className='content'>Email:</h1>
                        <div className='email'>
                        </div>
                        <h1 className='content'>First and Last Name:</h1>
                        <div className='username'>
                        </div>
                        <h1 className='content'>Password:</h1>
                        <div className='password'>
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
