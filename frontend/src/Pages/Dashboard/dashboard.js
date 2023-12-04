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
  const [parentHighlightedDays, setParentHighlightedDays] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const userId = getUserID();
      const userType = getUserType();

      // Fetch upcoming payments
      const paymentData = await getUpcomingPayment(userId, userType);
      const formattedPayments = paymentData.map(payment => {
        const nextDueDate = new Date(payment.nextDueDate);
        nextDueDate.setDate(nextDueDate.getDate() + 1);

        return {
          ...payment,
          nextDueDate: nextDueDate.toLocaleDateString(),
        };
      });
      setUpcomingPayments(formattedPayments);

      // Fetch notifications
      const notificationData = await getNotif(userId);
      setNotifications(notificationData);

      // Fetch expense categories
      const expenseCategoryData = await getExpenseCategories(userId);
      setCategories(expenseCategoryData.categories);
      setAmounts(expenseCategoryData.amounts);

      // Set loading states
      setLoading(false);
      setLoadingNotifications(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately
      setLoading(false);
      setLoadingNotifications(false);
    }
  };

  // Call the fetchData function
  fetchData();
}, [username, parentHighlightedDays]);

const handleHighlightDaysChange = (newHighlightedDays) => {
  // Update the parent state when highlightedDays changes
  setParentHighlightedDays(newHighlightedDays);
};

   return (
    <div className="screen">
      <div className="page">
        <div className="center">
          <Sidebar username={username} />
          <Card>
            <h2 className='category'>Add Payments</h2>
            <Calendar onHighlightDaysChange={handleHighlightDaysChange}/>
          </Card>
          <Card>
            <h2 className='category'>Upcoming Payments</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul style={{ width: '100%', listStyle: 'none', padding: 0 }}>
              {upcomingPayments.map((payment, index) => (
                <li key={index} className="notification-list" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
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
              <ul style={{ width: '100%', listStyle: 'none', padding: 0 }}>
                {notifications.map((notification, index) => (
                  <li key={index} className="notification-list" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div >
                      {notification.content}
                    </div>
                    <button className='del' onClick={() => handleDeleteNotif(notification._id)}>Clear</button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
          <h2 className='cat'>Total Expenses</h2>
            <BG categories={categories} amounts={amounts}/>
          </Card>
          
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
