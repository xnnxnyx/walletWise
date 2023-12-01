import './dashboard.css';
import '../theme.css';
import '../../partials/sidebar.css'
import Sidebar from '../../partials/sidebar';
import React, { useState, useEffect } from "react";
import Card from '../../partials/Cards/cards';
import Calendar from '../../partials/Calendar/calendar';

export const DashboardPage = ({username}) => {
  console.log("Username in Parent Component:", username);
  // Use the passed username as the initial state
  useEffect(() => {
    // Example: Fetch session data or set it using your authentication mechanism
    // For demonstration purposes, you can log the username here
    console.log("Username in DashboardPage useEffect:", username);
  }, [username]); // Update the effect when the username prop changes

  return (
    <div className="screen">
      <div className="page">
        <div className="center">
          {/* Pass the session.username to the Sidebar component */}
          <Sidebar username={username} />
          <Card><Calendar></Calendar></Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
