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
            <Calendar onHighlightDaysChange={handleHighlightDaysChange}/>
          </Card>
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
            <BG categories={categories} amounts={amounts}/>
          </Card>
          
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
