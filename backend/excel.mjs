import google from "googleapis";
import User from "./models/User.mjs";
import axios from "axios";
import Expense from "./models/Expense.mjs";
import Notification from "./models/Notification.mjs";
import mongoose from "mongoose";

export async function getData() {
  const spreadsheetId = '113wmQmY6N0zzM2iZY5AzA0TvX2BV4JeAe1ViY8HvYJc';
  const range = 'SheetQR!A:F';
  const apiKey = 'AIzaSyA_Espv5PiD_-6fgQj1nDyX8wb5e-kytp4';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  //https://sheets.googleapis.com/v4/spreadsheets/113wmQmY6N0zzM2iZY5AzA0TvX2BV4JeAe1ViY8HvYJc/values/SheetQR!C:C?key=AIzaSyA_Espv5PiD_-6fgQj1nDyX8wb5e-kytp4

  try {
    const response = await axios.get(url);
    const [, ...values] = response.data.values;

    if (values.length) {

      for (const row of values) {
        let u = row[2];
        const [userId, userType] = u.split('/');

        const dateString = row[0];
        const [month, day, year, time] = dateString.split(/[\/ :]/); // Split by "/", " ", and ":"
        const dateObject = new Date(year, month - 1, day, ...time.split(':')); 
        
        const dateOnly = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
            
            const existingExpense = await Expense.findOne({ 
                userRef: userId, 
                description: row[4],
                amount: row[5], 
                category: row[3], 
                date: { $gte: dateOnly, $lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000) }
            });
    
            if (existingExpense == null) {
                const newExpense = new Expense({
                    userRef: userId, 
                    userType: userType,
                    description: row[4],
                    amount: row[5],
                    category: row[3]
                });
                
                await newExpense.save();

                const newNotif = new Notification({
                  userRef: userId, 
                  userType: userType,
                  content: `Expense added for ${row[3]} with amount \$${row[5]}!`
                });

                await newNotif.save();
            } else {
                //console.log('Expense already exists:', existingExpense);
            }
        //}
    }

    } else {
      console.log('No data found.');
    }
    
  } catch (error) {
    console.error('Error retrieving data:', error.response ? error.response.data : error.message);
  }

}

// getData();