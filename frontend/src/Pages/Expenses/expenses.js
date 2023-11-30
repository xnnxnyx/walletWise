import './expenses.css';
import '../theme.css';
import '../../partials/sidebar.css'
import '../../partials/Cards/cards.css'
import Sidebar from '../../partials/sidebar';
import Card from '../../partials/Cards/cards';
import React from "react";
import { getUsername, getUserID } from '../../api.mjs'

export const ExpensesPage = () =>{

  const username = getUsername();
  console.log("HEYYYYY THIS IS USUUUSUSUER", username);

  const userID = getUserID();
  console.log("PLS WORK!!!!!!!!!!!", userID);

    return (
    <div className="screen">
      <div className="page">
        <div className="center">
            <Sidebar/>
            {/* <div className='title'>
                <h1>Expenses</h1>
                <p> welcome  to your financial command center for tracking and managing all your spending effortlessly</p>
            </div> */}
             <div className='middle'>
             <div className='four'>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
            </div>
             </div>
        </div>
      </div>
    </div>
    );
};

export default ExpensesPage;