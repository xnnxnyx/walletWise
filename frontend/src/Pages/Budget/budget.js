import './budget.css';
import '../theme.css';
import '../../partials/sidebar.css';
import '../../partials/Cards/cards.css';  // Include the cards.css for styling
import Sidebar from '../../partials/sidebar';
import Card from '../../partials/Cards/cards';
import React, { useEffect, useState } from "react";
import { getUserID, getBudget, getExpenses, addBudget, getUserType, updateBudget } from "../../api.mjs";
import Pie from '../../partials/PieChart/pie';

const allCategories = ["Food", "Groceries", "Shopping", "Personal Care", "Insurance", "Tuition", "Transportation", "Entertainment", "Utilities", "Miscellaneous"];

const createCategoryMap = (expenses, budgets) => {

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
      });
  }, [userID]);

  useEffect(() => {
    getExpenses(userID)
      .then((ExpenseData) => {
        setExpenses(ExpenseData);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
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
  
      const updatedBudget = await getBudget(userID);
      setBudget(updatedBudget);
  
      setNewBudgetCategory('');
      setNewBudgetAmount('');
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const handleChangeBudget = async (e) => {
    console.log("THIS IS NEW CHANGE : ", newChangeBudgetCategory)
    e.preventDefault();

    try {
      await updateBudget(userID, userType, newChangeBudgetCategory, parseFloat(newChangeBudgetAmount));

      const updatedBudget = await getBudget(userID);
      setBudget(updatedBudget);

      setNewChangeBudgetCategory('');
      setNewChangeBudgetAmount('');
    } catch (error) {
      console.error("Error changing budget:", error);
    }
  };

  const nonBudgetCategories = allCategories.filter(category => !categoryMap[category]);
  const budgetCategories = Object.keys(categoryMap);

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
                    <select
                      className="input-field"
                      value={newBudgetCategory}
                      onChange={(e) => setNewBudgetCategory(e.target.value)}
                    >
                      {/* Display categories that are NOT in the budget map */}
                      <option value="">Select a category</option>
                      {nonBudgetCategories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
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
                <form className="center bg-white p-4 rounded" onSubmit={handleChangeBudget}>
                  <label className="block mb-2">
                    Category:
                    <select
                      className="input-field"
                      value={newChangeBudgetCategory}
                      onChange={(e) => setNewChangeBudgetCategory(e.target.value)}
                    >
                    <option value="">Select a category</option>
                    {budgetCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
