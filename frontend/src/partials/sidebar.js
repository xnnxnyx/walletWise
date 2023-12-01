import React from 'react';
import { NavLink } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import QRcomp from '../components/QRcode/qrcode';
import axios from 'axios';  // Import Axios
import { signout } from '../api.mjs';
import { getRandom } from '../api.mjs';
import { getUsername, getUserID } from '../api.mjs';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const logoOne = require("./wallet.png");
  const dash = require("./dash.png");
  const settings = require("./settings.png");
  const expense = require("./expenses.png");
  const budget = require("./budget.png");
  const navigate = useNavigate();


const out = async (e) => {
  e.preventDefault();
  try {
    await signout();
    console.log('Signout successful');
    navigate('/');
  } catch (error) {
  }
};

  return (
    <div className='side'>
      <NavLink to="/" onClick={out}>
        <h1 className='l'>
          WalletWise
          <img src={logoOne} alt="Wallet Icon" className="w-15 h-15 img1" />
        </h1>
      </NavLink>
      <div className='tabs'>
        <div className='row1'>
        <img src={dash} alt="Dashboard Icon" className="w-6 h-6 img1" />
          <NavLink to="/dashboard" className='d'>
            <h1 className='dash'>Dashboard</h1>
          </NavLink>
        </div>
        <div className='row2'>
        <img src={expense} alt="Expense Icon" className="w-6 h-6 img2" />
          <NavLink to="/expenses" className='e' >
            <h1 className='expenses'>Expenses</h1>
          </NavLink>
        </div>
        <div className='row3'>
        <img src={budget} alt="Budget Icon" className="w-6 h-6 img3" />
          <NavLink to="/budget" className='b' >
            <h1 className='budgets'>Budget</h1>
          </NavLink>
        </div>
        <div className='row4'>
        <img src={settings} alt="Chat Icon" className="w-6 h-6 img4" />
        <NavLink to="/chat" className='ch'>
            <h1 className='chat'>Settings</h1>
        </NavLink>
        </div>
      </div>
      <div className='qr'>
        <h1 className='prompt'>Add Expense</h1>
        <p className='scan'>scan:</p>
        <div className='box'>
          <QRcomp/>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
