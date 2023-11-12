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
import { QRcomp } from './components/QRcode/qr';


export default function Home() {

  const [expenses, setExpenses] = useState([]);
  const [username, setUsername] = useState("");

  const fetchExpenses = async (userId) => {
    try {
      const response = await fetch(`http://localhost:4000/expenses/${userId}`);
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  // // useEffect to fetch expenses on component mount
  // useEffect(() => {
  //   // Provide a default userId or fetch it from your authentication system
  //   const defaultUserId = '65500cc84fa3321223d6346a';
  //   fetchExpenses(defaultUserId);
  // }, []); // Empty dependency array ensures it runs only on mount


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

      <ExpenseForm onFormSubmit={fetchExpenses} />

      {/* Display individual expenses */}
      {expenses.map((expense, index) => (
        <div key={index}>
          Category: {Object.keys(expense)[0]}, Amount: {Object.values(expense)[0]}
        </div>
      ))}

      {/* BarGraph component to display a bar graph of expenses */}
      <BarGraph expenses={expenses} />

      <div>
        <QRcomp username={username}/>
        <input
        value={username}
        onChange={(e) => {
          setUsername(e.target.value)
        }}
        />
    
      </div>

    </>
    );
  }

