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

  useEffect(() => {

    const userId = getUserID();
    const userType = getUserType();
    const fetchUpcomingPayments = async () => {
      try {
        const data = await getUpcomingPayment(userId, userType);

        const formattedData = data.map(payment => ({
          ...payment,
          nextDueDate: new Date(payment.nextDueDate).toLocaleDateString(),
        }));

        setUpcomingPayments(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching upcoming payments:', error);
        setLoading(false);
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
 


   return (
    <div className="screen">
      <div className="page">
        <div className="center">
          <Sidebar username={username} />
          <Card><h2 className='category'>Add Payments</h2><Calendar></Calendar></Card>
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
