import React from 'react';
import './setbudget.css';
import '../theme.css';

function SetbudgetPage() {
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
                <div className='login'>
                    <div className='pic'>
                        <div className='uploadpic'></div>
                        <h1 className='welcome'>Please set your budget goal!</h1>
                    </div>
                    <div className='input'>
                        <h1 className='content'>Budget Goal:</h1>
                        <div className='budget'>
                        <input type="budget" className='budget' placeholder="$00.00" />
                        </div>
                    </div>
                    <div className='click'>
                    <button type="button" className="next" onClick={handleNextClick}>
                        DONE
                    </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default SetbudgetPage;
