import './dashboard.css';
import '../theme.css';
import '../../partials/sidebar.css'
import Sidebar from '../../partials/sidebar';
import React, { useState, useEffect } from "react";
import Card from '../../partials/Cards/cards';
import Calendar from '../../partials/Calendar/calendar';
import { getUpcomingPayment, getUserType, getUserID } from '../../api.mjs';


// You need to replace userId and userType with actual values


export const DashboardPage = ({username}) => {
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  // Use the passed username as the initial state
  useEffect(() => {
    // Fetch upcoming payments when the component mounts
    const userId = getUserID();
    const userType = getUserType();
    const fetchUpcomingPayments = async () => {
      try {
        const data = await getUpcomingPayment(userId, userType);
        console.log('Upcoming Payments:', data);

        // Update state with fetched payments
        setUpcomingPayments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching upcoming payments:', error);
        setLoading(false);
        // Handle error appropriately
      }
    };
 
     fetchUpcomingPayments();
 
   }, [username]); // Update the effect when the username prop changes
 


  return (
    <div className="screen">
      <div className="page">
        <div className="center">
          {/* Pass the session.username to the Sidebar component */}
          <Sidebar username={username} />
          <Card><Calendar></Calendar></Card>
          <Card>
            <h2>Upcoming Payments</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {upcomingPayments.map((payment) => (
                  <li key={payment.id}>
                    {/* Display payment details */}
                    {payment.amount} - {payment.date}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
