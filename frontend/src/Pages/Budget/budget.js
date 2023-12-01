import './budget.css';
import '../theme.css';
import '../../partials/sidebar.css'
import '../../partials/Cards/cards.css'
import Sidebar from '../../partials/sidebar';

import React, { useEffect, useState }  from "react";
import { getUserID, getBudget, getExpenses } from "../../api.mjs";
import Pie from '../../partials/PieChart/pie';

const createCategoryMap = (expenses, budgets) => {
  // Your category map logic here
  // Example:
  const categoryMap = {};
  budgets.forEach((budget) => {
    const category = Object.keys(budget)[0];
    const amount = Object.values(budget)[0];

    if (!categoryMap[category]) {
      categoryMap[category] = { expense: 0, budget: 0 };
    }
    categoryMap[category].budget += amount;
  });

  expenses.forEach((expense) => {
    const category = Object.keys(expense)[0];
    const amount = Object.values(expense)[0][0];

    if (categoryMap[category]) {
      categoryMap[category].expense += amount;
    }
  });

  return categoryMap;
};


export const BudgetPage = () =>{

  const userID = getUserID();
  const [budget, setBudget] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    getBudget(userID)
      .then((budgetData) => {
        console.log(budgetData);
        setBudget(budgetData);
      })
      .catch((error) => {
        console.error("Error fetching budget:", error);
        // Handle the error gracefully
      });
  }, [userID]);


  useEffect(() => {
    getExpenses(userID)
      .then((ExpenseData) => {
        console.log(ExpenseData);
        setExpenses(ExpenseData);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
        // Handle the error gracefully
      });
  }, [userID]);

  useEffect(() => {
    // Function to create category map
    const createCategoryMap = () => {
      const map = {};

      // Loop through budget and populate the map
      budget.forEach((item) => {
        const category = Object.keys(item)[0];
        const amount = Object.values(item)[0];
        const spent = calculateExpensesTotal(category);
        const remaining = amount - spent;

        map[category] = [spent, remaining];
      });

      setCategoryMap(map);
    };

    // Function to calculate total expenses for a category
    const calculateExpensesTotal = (category) => {
      return expenses.reduce((total, expense) => {
        if (Object.keys(expense)[0] === category) {
          return total + Object.values(expense)[0][0];
        }
        return total;
      }, 0);
    };

    // Trigger category map creation whenever budget or expenses change
    createCategoryMap();
  }, [budget, expenses]);
  
    
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
            {Object.entries(categoryMap).map(([category, [spent, remaining]], index) => (
                <Pie key={index} category={category} spent={spent} remaining={remaining} />
            ))}
            </div>
            </div>
        </div>
      </div>
    </div>
    );
};

export default BudgetPage;
