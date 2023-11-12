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


export default function Home() {

  const [values, setValues] = useState({ expenses: [], budgets: [] });

  const fetchData = async (userId) => {
    try {
      // Fetch expenses
      const response = await fetch(`http://localhost:4000/expenses/${userId}`);
      const expensesData = await response.json();

      // Fetch budgets
      const budgetsResponse = await fetch(`http://localhost:4000/budgets/${userId}`);
      const budgetsData = await budgetsResponse.json();

      // Update state with both expenses and budgets
      setValues({ expenses: expensesData, budgets: budgetsData });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
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
    </>
    );
  }

