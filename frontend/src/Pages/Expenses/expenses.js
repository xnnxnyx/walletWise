import './expenses.css';
import '../theme.css';
import '../../partials/sidebar.css'
import '../../partials/Cards/cards.css'
import Sidebar from '../../partials/sidebar';
import Card from '../../partials/Cards/cards';// Make sure to use the correct path
import React from "react";
import { getUsername, getUserID, getExpenses } from '../../api.mjs';
import { useState, useEffect } from 'react';

export const ExpensesPage = () => {
  const userID = getUserID();
  const [expensesData, setExpenses] = useState([]);
  const icn = require("./ex.png");

  useEffect(() => {
    getExpenses(userID)
      .then((expensesData) => {
        setExpenses(expensesData);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
      });
  }, [userID]);

  const groupExpensesByCategory = () => {
    const groupedExpenses = {};

    expensesData.forEach((expense) => {
      const category = Object.keys(expense)[0];
      const [amount, description, date] = expense[category];

      if (groupedExpenses[category]) {
        groupedExpenses[category].push({ amount, description, date });
      } else {
        groupedExpenses[category] = [{ amount, description, date }];
      }
    });

    return groupedExpenses;
  };

  return (
    <div className="screen">
      <div className="page">
        <div className="center">
          <Sidebar />
          {/* Display categories and amounts based on expensesData */}
          <div className="middle">
            {Object.entries(groupExpensesByCategory()).map(([category, expenses], index) => (
              <Card key={index}>
                <h2 className='category'>{category}</h2>
                <div className="four">
                  {expenses.map(({ amount, description, date }, i) => (
                    <div key={i}>
                      <img src={icn} alt="Cart Icon" className="w-6 h-6 float-left ml-6 mr-2 cart" />
                      <p className='float-left ml-2 mr-3 date'>{`${new Date(date).toISOString().split('T')[0]}`}</p>
                      <p className='float-left ml-2 mr-3 description'>{`${description}`}</p>
                      <p className='float-right ml-20 mr-3 amount'>{`+$${amount}`}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

            {/* Display a message if there are no expenses */}
            {expensesData.length === 0 && (
              <Card>
                <div className="middle">
                  <p>No expenses found for the user.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
