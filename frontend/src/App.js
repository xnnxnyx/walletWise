import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogorsignPage from "./Pages/LogorSign/logorsign";
import SignUpPage from "./Pages/Signup/signup";
import SetbudgetPage from "./Pages/SetBudget/setbudget";
import LoginPage from "./Pages/Login/login";
import DashboardPage from "./Pages/Dashboard/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogorsignPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/setbudget" element={<SetbudgetPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
