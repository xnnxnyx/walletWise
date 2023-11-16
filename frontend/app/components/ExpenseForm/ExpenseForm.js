// // components/ExpenseForm.js
// import React, { useState } from 'react';

// export function ExpenseForm({ onFormSubmit }) {
//   const [userId, setUserId] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onFormSubmit(userId);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         User ID:
//         <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
//       </label>
//       <button type="submit">Fetch Expenses</button>
//     </form>
//   );
// }

import React, { useState } from 'react';

export function ExpenseForm({ onFormSubmit }) {
  const [userId, setUserId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(userId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        User ID:
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
      </label>
      <button type="submit">Fetch Expenses and Budgets</button>
    </form>
  );
}

