// import Image from 'next/image'
// import styles from './page.module.css'

// export default function Home() {
//   return (<></>
//   )
// }


// 'use client'

// import styles from './page.module.css'

// export default function Home() {

//     return (
//         <div className={`${styles.hello}`}>
//           Hello World!
//         </div>
//     );
// }

'use client'

import  React, { useState, useEffect } from 'react';
//import styles from './page.module.css'
import { ExpenseForm } from './components/ExpenseForm/ExpenseForm';
import BarGraph from './components/BarGraph/BarGraph';
import DonutChart from './components/DonutChart/DonutChart';


export default function Home() {

  const [values, setValues] = useState({ expenses: [], budgets: [], categoryMap: {} });

  const fetchData = async (userId) => {
    try {
      // Fetch expenses
      const response = await fetch(`http://localhost:4000/expenses/${userId}`);
      const expensesData = await response.json();

      // Fetch budgets
      const budgetsResponse = await fetch(`http://localhost:4000/budgets/${userId}`);
      const budgetsData = await budgetsResponse.json();

      // Create a category map
      const categoryMap = createCategoryMap(expensesData, budgetsData);

      // Update state with both expenses and budgets
      setValues({ expenses: expensesData, budgets: budgetsData, categoryMap: categoryMap });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // useEffect(() => {
  //   // Execute your function before printing the category map
  //   console.log('Category map:', values.categoryMap);
  // }, [values.categoryMap]); // This effect will run whenever values.categoryMap changes


  // const generateBudgetMap = (expenses, budgets) => {
  //   const categoryMap = {};

  //   budgets.forEach((budget) => {
  //     const category = budget.category;
  //     const budgetAmount = budget.amount;
  //     const expenseAmount = expenses.reduce((total, expense) => {
  //       return expense.category === category ? total + expense.amount : total;
  //     }, 0);

  //     categoryMap[category] = { expense: expenseAmount, budget: budgetAmount };
  //   });

  //   return categoryMap;
  // };

  function createCategoryMap(expensesData, budgetsData) {
    const categoryMap = {};
  
    budgetsData.forEach((budget) => {
      const category = Object.keys(budget)[0];
      const amount = Object.values(budget)[0];
  
      if (!categoryMap[category]) {
        categoryMap[category] = { expense: 0, budget: 0 };
      }
      categoryMap[category].budget += amount;
    });
    
    expensesData.forEach((expense) => {
      const category = Object.keys(expense)[0];
      const amount = Object.values(expense)[0];
  
      if (categoryMap[category]) {
        categoryMap[category].expense += amount;
      }
      
    });
  
    return categoryMap;
  }


    return (
      // <>
      //   <ExpenseForm onFormSubmit={fetchExpenses} />
        
      //   {expenses.map((expense, index) => (
      //     <div key={index}>
      //       Category: {Object.keys(expense)[0]}, Amount: {Object.values(expense)[0]}
      //     </div>
      //   ))} 
      // </>
      <>
      {/* ExpenseForm component to add new expenses */}
      {/* <ExpenseForm onFormSubmit={() => fetchExpenses('65500cc84fa3321223d6346a')} /> */}

      <ExpenseForm onFormSubmit={fetchData} />

      {/* Display individual expenses */}
      {values.expenses.map((expense, index) => (
        <div key={index}>
          Category: {Object.keys(expense)[0]}, Amount: {Object.values(expense)[0]}
        </div>
      ))}

      {/* BarGraph component to display a bar graph of expenses */}
      <BarGraph expenses={values.expenses} />
      {/* Display the category map */}
      <div>
        <h3>Category Map:</h3>
        <ul>
          {Object.entries(values.categoryMap)?.map(([category, { expense, budget }], index) => (
            <li key={index}>
              Category: {category}, Expense: {expense}, Budget: {budget}
            </li>
          ))}
        </ul>
      </div>
      {/* DonutChart components for each category in budgets */}
      {Object.entries(values.categoryMap).map(([category, { expense, budget }], index) => (
        <DonutChart
          key={index}
          budget={budget}
          expenses={expense}
          category={category}
        />
      ))};
    </>
    );
  }

