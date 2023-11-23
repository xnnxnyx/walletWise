import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignUpPage } from "./Pages/Signup/signup";
import SetbudgetPage from "./Pages/SetBudget/setbudget";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/setbudget" element={<SetbudgetPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
