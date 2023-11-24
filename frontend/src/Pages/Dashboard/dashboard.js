import './dashboard.css';
import '../theme.css';
import '../../partials/sidebar.css'
import Sidebar from '../../partials/sidebar';
import React from "react";

export const DashboardPage = () =>{
    
    // const logoOne = require("./wallet.png");

    return (
    <div className="screen">
      <div className="page">
        <div className="center">
        <Sidebar/>
        </div>
      </div>
    </div>
    );
};

export default DashboardPage;