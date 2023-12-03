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

        const formattedData = data.map(payment => ({
          ...payment, // Copy all existing properties from the 'payment' object
          nextDueDate: new Date(payment.nextDueDate).toLocaleDateString(), // Format the 'nextDueDate' property
        }));
        // Update state with fetched payments
        setUpcomingPayments(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching upcoming payments:', error);
        setLoading(false);
        // Handle error appropriately
      }
    };
 
     fetchUpcomingPayments();
 
   }, [username, upcomingPayments]); // Update the effect when the username prop changes
 


   return (
    <div className="screen">
      <div className="page">
        <div className="center">
          <Sidebar username={username} />
          <Card><Calendar></Calendar></Card>
          <Card>
            <h2 className='category'>Upcoming Payments</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul className="payment-list grid grid-rows-2 gap-4 ml-2 place-items-center">
              {upcomingPayments.map((payment, index) => (
                <li key={index} className="content">
                  {/* Display payment details */}
                  <div className="grid grid-rows-1">
                    <div>
                      <strong>Amount:</strong> {payment.amount}
                    </div>
                    <div>
                      <strong>Category:</strong> {payment.category}
                    </div>
                    <div>
                      <strong>Date:</strong> {payment.nextDueDate}
                    </div>
                  </div>
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
