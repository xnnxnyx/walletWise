import React from 'react';
import { Link } from 'react-router-dom';
import QRcomp from '../components/QRcode/qrcode';

function Sidebar() {
  const logoOne = require("./wallet.png");
  const dash = require("./dash.png");
  const chat = require("./chat.png");
  const expense = require("./expenses.png");
  const budget = require("./budget.png");

  return (
    <div className='side'>
      <Link to="/">
        <h1 className='l'>
          WalletWise
          <img src={logoOne} alt="Wallet Icon" className="w-20 h-20 img1" />
        </h1>
      </Link>
      <div className='tabs'>
        <div className='row1'>
        <img src={dash} alt="Dashboard Icon" className="w-6 h-6 img1" />
          <Link to="/dashboard">
            <h1 className='dash'>Dashboard</h1>
          </Link>
        </div>
        <div className='row2'>
        <img src={expense} alt="Expense Icon" className="w-6 h-6 img2" />
          <Link to="/expenses">
            <h1 className='expenses'>Expenses</h1>
          </Link>
        </div>
        <div className='row3'>
        <img src={budget} alt="Budget Icon" className="w-6 h-6 img3" />
          <Link to="/budget">
            <h1 className='budgets'>Budget</h1>
          </Link>
        </div>
        <div className='row4'>
        <img src={chat} alt="Chat Icon" className="w-6 h-6 img4" />
          <Link to="/chat">
            <h1 className='chat'>ChatAI</h1>
          </Link>
        </div>
      </div>
      <div className='qr'>
        <h1 className='prompt'>Add Expense</h1>
        <p className='scan'>scan:</p>
        <div className='box'>
          <QRcomp />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
