import React from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import QRcomp from '../components/QRcode/qrcode';
import axios from 'axios';  // Import Axios

function Sidebar({username}) {
  console.log("Username in Sidebar:", username);
  const logoOne = require("./wallet.png");
  const dash = require("./dash.png");
  const settings = require("./settings.png");
  const expense = require("./expenses.png");
  const budget = require("./budget.png");

  const random = () => {
  
    axios.get('http://localhost:4000/budgets/1', { withCredentials: true })
      .then((response) => {
        console.log('Login successful:', response.data);
      })
      .catch((error) => {
        console.error('Login failed:', error);
        // Handle the case where the login failed (show an error message to the user, etc.)
      });
};

  return (
    <div className='side'>
      <NavLink to="/">
        <h1 className='l'>
          WalletWise
          <img src={logoOne} alt="Wallet Icon" className="w-20 h-20 img1" />
        </h1>
      </NavLink>
      <div className='tabs'>
        <div className='row1'>
        <img src={dash} alt="Dashboard Icon" className="w-6 h-6 img1" />
          <NavLink to="/dashboard" exact activeClassName='d'>
            <h1 className='dash'>Dashboard</h1>
          </NavLink>
        </div>
        <div className='row2'>
        <img src={expense} alt="Expense Icon" className="w-6 h-6 img2" />
          <NavLink to="/expenses" exact activeClassName='e'>
            <h1 className='expenses'>Expenses</h1>
          </NavLink>
        </div>
        <div className='row3'>
        <img src={budget} alt="Budget Icon" className="w-6 h-6 img3" />
          <NavLink to="/budget" activeClassName='b'>
            <h1 className='budgets'>Budget</h1>
          </NavLink>
        </div>
        <div className='row4'>
        <img src={settings} alt="Chat Icon" className="w-6 h-6 img4" />
          <button className='c' onClick={random}>
            <h1 className='chat'>Settings</h1>
          </button>
        </div>
      </div>
      <div className='qr'>
        <h1 className='prompt'>Add Expense</h1>
        <p className='scan'>scan:</p>
        <div className='box'>
          <QRcomp username={username} />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
