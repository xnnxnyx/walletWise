// import './expenses.css';
// import '../theme.css';
// import '../../partials/sidebar.css'
// import '../../partials/Cards/cards.css'
// import Sidebar from '../../partials/sidebar';
// import Card from '../../partials/Cards/cards';
// import React from "react";
// import { getUsername, getUserID, getExpenses } from '../../api.mjs';
// import { useState, useEffect } from 'react';

// export const ExpensesPage = () =>{

//   // const username = getUsername();
//   // console.log("HEYYYYY THIS IS USUUUSUSUER", username);

//   const userID = getUserID();
//   console.log("this is the users id", userID);
//   const [expensesData, setExpenses] = useState([]);

//   useEffect(() => {
//     getExpenses(userID)
//       .then((expensesData) => {
//         console.log(expensesData);
//         setExpenses(expensesData);
//         console.log("these r the expense data", expensesData);
//       })
//       .catch((error) => {
//         console.error("Error fetching expenses:", error);
//         // Handle the error gracefully
//       });
//   }, [userID]);

//     return (
//       <div className="screen">
//       <div className="page">
//         <div className="center">
//           <Sidebar/>
//           <div className='allExpenses'>
//             {/* Display categories and amounts based on expensesData */}
//           {expensesData.map((categoryExpenses, index) => (
//             <div key={index} className="middle">
//               <h2>{Object.keys(categoryExpenses)[0]}</h2>
//               <div className="four">
//                 <p>{categoryExpenses[Object.keys(categoryExpenses)[0]]}</p>
//                 {/* Add other expense details as needed */}
//               </div>
//             </div>
//           ))}
//           </div>

//           {/* Display a message if there are no expenses */}
//           {expensesData.length === 0 && (
//             <div className="middle">
//               <p>No expenses found for the user.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//     );
// };

// export default ExpensesPage;

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
        console.log(expensesData);
        setExpenses(expensesData);
        console.log("these are the expense data", expensesData);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
        // Handle the error gracefully
      });
  }, [userID]);

  // return (
  //   <div className="screen">
  //     <div className="page">
  //       <div className="center">
  //         <Sidebar />
  //         {/* Display categories and amounts based on expensesData */}
  //         <div className="middle">
  //           <div className="allExpenses">
  //             {expensesData.map((categoryData, index) => (
  //               <Card key={index}>
  //                 <h2>{Object.keys(categoryData)[0]}</h2>
  //                 <div className="four">
  //                   <p>{Object.values(categoryData)[0]}</p>
  //                   {/* Add other expense details as needed */}
  //                 </div>
  //               </Card>
  //             ))}
  //           </div>

  //           {/* Display a message if there are no expenses */}
  //           {expensesData.length === 0 && (
  //             <Card>
  //               <div className="middle">
  //                 <p>No expenses found for the user.</p>
  //               </div>
  //             </Card>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
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
