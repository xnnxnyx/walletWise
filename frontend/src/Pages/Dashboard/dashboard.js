import './dashboard.css';
import '../theme.css';
import '../../partials/sidebar.css'
import Sidebar from '../../partials/sidebar';
import React, { useState, useEffect } from "react";
import Card from '../../partials/Cards/cards';
import BG from '../../partials/BarGraph/bargraph';
import Calendar from '../../partials/Calendar/calendar';
import { getUpcomingPayment, getUserType, getUserID, getNotif, deletenotif, getExpenseCategories } from '../../api.mjs';


const handleDeleteNotif = async (notifId) => {
  try {
    const response = await deletenotif(notifId);
  } catch (error) {
    console.error('Error deleting notification:', error.message);
  }
};
  

export const DashboardPage = ({username}) => {
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [expenseCategoriesData, setExpenseCategories] = useState({ categories: [], amounts: [] });
  const [categories, setCategories] = useState([]);
  const [amounts, setAmounts] = useState([]);

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

    const fetchNotifications = async () => {
      try {
        const notificationData = await getNotif(userId);
        setNotifications(notificationData);
        setLoadingNotifications(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoadingNotifications(false);
      }
    };

    const fetchExpenseCategories = async () => {
      try {
        const data = await getExpenseCategories(userId);
        //setExpenseCategories(data);
        //console.log("These are the expenseCategoriesData: ", data);
        setCategories(data.categories);
        setAmounts(data.amounts);
      } catch (error) {
        console.error('Error fetching expense categories:', error);
      }
    };
    

    fetchNotifications();
    fetchUpcomingPayments();
    fetchExpenseCategories();
 
    }, [username]);
 //  }, [username, upcomingPayments]); // Update the effect when the username prop changes
 


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
          <Card>
            <h2 className='category'>Notifications</h2>
            {loadingNotifications ? (
              <p>Loading notifications...</p>
            ) : (
              <ul className="notification-list">
                {notifications.map((notification, index) => (
                  <li key={index} className="content">
                    <div>
                      <strong>Content:</strong> {notification.content}
                      <button className='next' onClick={() => handleDeleteNotif(notification._id)}>Clear</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
          <h2 className='category'>Total Expenses</h2>
            {/* <div>THis is amt ${amounts}</div>
            <div>THis is cat ${categories}</div> */}
            <BG categories={categories} amounts={amounts}/>
          </Card>
          
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
