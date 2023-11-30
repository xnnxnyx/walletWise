import './budget.css';
import '../theme.css';
import '../../partials/sidebar.css'
import '../../partials/Cards/cards.css'
import Sidebar from '../../partials/sidebar';
import Card from '../../partials/Cards/cards';
import React, { useEffect, useState }  from "react";
import { getUserID, getBudget, getExpenses } from "../../api.mjs";

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
    const amount = Object.values(expense)[0];

    if (categoryMap[category]) {
      categoryMap[category].expense += amount;
    }
  });

  return categoryMap;
};


export const BudgetPage = () =>{

  const userID = getUserID();
  const [budget, setBudget] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  // useEffect(() => {
  //   getBudget(userID)
  //     .then((budgetData) => {
  //       console.log(budgetData);
  //       setBudget(budgetData);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching budget:", error);
  //       // Handle the error gracefully
  //     });
  // }, [userID]);

  useEffect(() => {
    const fetchData = (userId) => {
      getExpenses(userId)
        .then((expensesData) => {
          return getBudget(userId)
            .then((budgetsData) => ({ expensesData, budgetsData }));
        })
        .then(({ expensesData, budgetsData }) => {
          const categoryMap = createCategoryMap(expensesData, budgetsData);
          setValues({ expenses: expensesData, budgets: budgetsData, categoryMap: categoryMap });
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };
  
    fetchData(userID);
  }, [userID]);
  
    
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
            {/* {budget.map((item, index) => (
                <Card key={index}>
                  <div className="budget-info">
                    <p>{`${Object.keys(item)[0]}: ${Object.values(item)[0]}`}</p>
                  </div>
                </Card>
              ))} */}
              {Object.entries(categoryMap).map(([category, { expense, budget }], index) => (
                <div className="budget-info">
                  <p>{`${category}: Expense - ${expense}, Budget - ${budget}`}</p>
                </div>
              
            ))}

            </div>
            </div>
        </div>
      </div>
    </div>
    );
};

export default BudgetPage;
