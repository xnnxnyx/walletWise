// import './budget.css';
// import '../theme.css';
// import '../../partials/sidebar.css'
// import Card from '../../partials/Cards/cards';
// import Sidebar from '../../partials/sidebar';

// import React, { useEffect, useState }  from "react";
// import { getUserID, getBudget, getExpenses } from "../../api.mjs";
// import Pie from '../../partials/PieChart/pie';

// const createCategoryMap = (expenses, budgets) => {
//   // Your category map logic here
//   // Example:
//   const categoryMap = {};
//   budgets.forEach((budget) => {
//     const category = Object.keys(budget)[0];
//     const amount = Object.values(budget)[0];

//     if (!categoryMap[category]) {
//       categoryMap[category] = { expense: 0, budget: 0 };
//     }
//     categoryMap[category].budget += amount;
//   });

//   expenses.forEach((expense) => {
//     const category = Object.keys(expense)[0];
//     const amount = Object.values(expense)[0][0];

//     if (categoryMap[category]) {
//       categoryMap[category].expense += amount;
//     }
//   });

//   return categoryMap;
// };


// export const BudgetPage = () =>{

//   const userID = getUserID();
//   const [budget, setBudget] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [categoryMap, setCategoryMap] = useState({});

//   useEffect(() => {
//     getBudget(userID)
//       .then((budgetData) => {
//         setBudget(budgetData);
//       })
//       .catch((error) => {
//         console.error("Error fetching budget:", error);
//         // Handle the error gracefully
//       });
//   }, [userID]);


//   useEffect(() => {
//     getExpenses(userID)
//       .then((ExpenseData) => {
//         setExpenses(ExpenseData);
//       })
//       .catch((error) => {
//         console.error("Error fetching expenses:", error);
//         // Handle the error gracefully
//       });
//   }, [userID]);

//   useEffect(() => {
//     // Function to create category map
//     const createCategoryMap = () => {
//       const map = {};

//       // Loop through budget and populate the map
//       budget.forEach((item) => {
//         const category = Object.keys(item)[0];
//         const amount = Object.values(item)[0];
//         const spent = calculateExpensesTotal(category);
//         const remaining = amount - spent;

//         map[category] = [spent, remaining];
//       });

//       setCategoryMap(map);
//     };

//     // Function to calculate total expenses for a category
//     const calculateExpensesTotal = (category) => {
//       return expenses.reduce((total, expense) => {
//         if (Object.keys(expense)[0] === category) {
//           return total + Object.values(expense)[0][0];
//         }
//         return total;
//       }, 0);
//     };

//     // Trigger category map creation whenever budget or expenses change
//     createCategoryMap();
//   }, [budget, expenses]);
  
    
//     return (
//     <div className="screen">
//       <div className="page">
//         <div className="cen">
//             <Sidebar/>
//             <div className='m'>
//             <div className='f'>
//             {Object.entries(categoryMap).map(([category, [spent, remaining]], index) => (
//                 <Pie key={index} category={category} spent={spent} remaining={remaining} />
//             ))}
//             </div>
//             </div>
//             <Card></Card>
//         </div>
//       </div>
//     </div>
//     );
// };

// export default BudgetPage;
import './budget.css';
import '../theme.css';
import '../../partials/sidebar.css';
import '../../partials/Cards/cards.css';  // Include the cards.css for styling
import Sidebar from '../../partials/sidebar';
import Card from '../../partials/Cards/cards';
import React, { useEffect, useState } from "react";
import { getUserID, getBudget, getExpenses, addBudget, getUserType } from "../../api.mjs";
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

export const BudgetPage = () => {
  const userID = getUserID();
  const userType = getUserType();
  const [budget, setBudget] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newChangeBudgetCategory, setNewChangeBudgetCategory] = useState('');
  const [newChangeBudgetAmount, setNewChangeBudgetAmount] = useState('');

  useEffect(() => {
    getBudget(userID)
      .then((budgetData) => {
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
        setExpenses(ExpenseData);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
        // Handle the error gracefully
      });
  }, [userID]);

  useEffect(() => {
    const createCategoryMap = () => {
      const map = {};

      budget.forEach((item) => {
        const category = Object.keys(item)[0];
        const amount = Object.values(item)[0];
        const spent = calculateExpensesTotal(category);
        const remaining = amount - spent;

        map[category] = [spent, remaining];
      });

      setCategoryMap(map);
    };

    const calculateExpensesTotal = (category) => {
      return expenses.reduce((total, expense) => {
        if (Object.keys(expense)[0] === category) {
          return total + Object.values(expense)[0][0];
        }
        return total;
      }, 0);
    };

    createCategoryMap();
  }, [budget, expenses]);

  const handleAddBudget = async (e) => {
    e.preventDefault();
  
    try {
      const result = await addBudget(userID, userType, newBudgetCategory, parseFloat(newBudgetAmount));
      console.log("budge result", result);
      console.log("Budget added successfully:", result);
  
      const updatedBudget = await getBudget(userID);
      setBudget(updatedBudget);
  
      setNewBudgetCategory('');
      setNewBudgetAmount('');
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const handleChangeBudget = async (e) => {
    e.preventDefault();

    try {
      await updateBudget(userID, newChangeBudgetCategory, parseFloat(newChangeBudgetAmount));

      const updatedBudget = await getBudget(userID);
      setBudget(updatedBudget);

      setNewChangeBudgetCategory('');
      setNewChangeBudgetAmount('');
    } catch (error) {
      console.error("Error changing budget:", error);
    }
  };

  return (
    <div className="screen">
      <div className="page">
        <div className="center">
          <Sidebar />
          <div className="middle m-6">
            <Card>
              <div className="container grid place-items-center h-screen">
                <h2 className="text-xl font-bold mb-4">Add Budget</h2>
                <form className="center bg-white p-4 rounded">
                  <label className="block mb-2">
                    Category:
                    <input
                      className="input-field"
                      type="text"
                      value={newBudgetCategory}
                      onChange={(e) => setNewBudgetCategory(e.target.value)}
                    />
                  </label>
                  <label className="block mb-2">
                    Amount:
                    <input
                      className="input-field"
                      type="number"
                      value={newBudgetAmount}
                      onChange={(e) => setNewBudgetAmount(e.target.value)}
                    />
                  </label>
                  <button
                    className="next py-2 rounded-md"
                    type="submit"
                    onClick={handleAddBudget}
                  >
                    Add Budget
                  </button>
                </form>
              </div>
            </Card>
            <Card>
              <div className="container grid place-items-center h-screen">
                <h2 className="text-xl font-bold mb-4">Change Budget</h2>
                <form className="center bg-white p-4 rounded">
                  <label className="block mb-2">
                    Category:
                    <input
                      className="input-field"
                      type="text"
                      value={newChangeBudgetCategory}
                      onChange={(e) => setNewChangeBudgetCategory(e.target.value)}
                    />
                  </label>
                  <label className="block mb-2">
                    Amount:
                    <input
                      className="input-field"
                      type="number"
                      value={newChangeBudgetAmount}
                      onChange={(e) => setNewChangeBudgetAmount(e.target.value)}
                    />
                  </label>
                  <button
                    className="next py-2 rounded-md"
                    type="submit"
                    onClick={handleChangeBudget}
                  >
                    Change Budget
                  </button>
                </form>
              </div>
            </Card>
            {Object.entries(categoryMap).map(([category, [spent, remaining]], index) => (
              <div key={index}> 
                {/* <h2 className='category'>{category}</h2> */}
                <Pie category={category} spent={spent} remaining={remaining} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default BudgetPage;
