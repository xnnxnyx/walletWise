// import { createServer } from "http";
// import express from "express";
// import Datastore from "nedb";

// const PORT = 4000;
// const app = express();

// app.use(express.json());

// const messages = new Datastore({
//   filename: "db/messages.db",
//   autoload: true,
//   timestampData: true,
// });

// const Message = function item(content, author) {
//   this.content = content;
//   this.author = author;
//   this.upvote = 0;
//   this.downvote = 0;
// };

// function getMessage(_id){
//     return new Promise(function(resolve, reject){
//         messages.findOne({ _id}, function (err, message) {
//           if (err) return reject(err);
//           return resolve(message);
//         });
//     })
// }

// function getMessages(page, limit){
//     return new Promise(function(resolve, reject){
//         limit = Math.max(5, limit ? parseInt(limit) : 5);
//         page = page || 0;
//         messages
//           .find({})
//           .sort({ createdAt: -1 })
//           .skip(page * limit)
//           .limit(limit)
//           .exec(function (err, messages) {
//             if (err) return reject(err);
//             return resolve(messages);
//           });
//     })
// }

// function addMessage(content, author){
//     return new Promise(function(resolve, reject){
//         const message = new Message(content, author);
//         messages.insert(message, function (err, message) {
//             if (err) return reject(err);
//             return resolve(message);
//         });
//     })
// }

// function updateMessage(message, action){
//     return new Promise(function(resolve, reject){
//         const update = {};
//         update[action] = 1;
//         messages.update(
//           { _id: message._id },
//           { $inc: update },
//           { multi: false },
//           function (err, num) {
//               if (err) return reject(err);
//               return resolve(message);
//           },
//         );
//     });
// }

// function deleteMessage(_id){
//     return new Promise(function(resolve, reject){
//         messages.remove(
//           { _id},
//           { multi: false },
//           function (err, num) {
//             if (err) return reject(err);
//            resolve(num);
//           },
//         );
//     });
// }

// app.get("/api/messages/", async function(req, res, next){
//     const messages = await getMessages(req.params.page, req.params.limit);
//     return res.json(messages)
// })

// app.post("/api/messages/", async function (req, res, next) {
//     await addMessage(req.body.content, req.body.author);
//     const messages = await getMessages(req.params.page, req.params.limit);
//     return res.json(messages);
// });

// app.patch("/api/messages/:id/", async function (req, res, next) {
//   if (["upvote", "downvote"].indexOf(req.body.action) == -1)
//     return res.status(400).end("unknown action" + req.body.action);
//   const message = await getMessage(req.params.id);
//   if (!message)
//     return res
//       .status(404)
//       .end("Message id #" + req.params.id + " does not exists");
//   await updateMessage(message, req.body.action);
//   const messages = await getMessages(req.params.page, req.params.limit);
//   return res.json(messages);
// });

// app.delete("/api/messages/:id/", async function (req, res, next) {
//     const message = await getMessage(req.params.id);
//     if (!message)
//       return res
//         .status(404)
//         .end("Message id #" + req.params.id + " does not exists");
//     await deleteMessage(req.params.id);
//     const messages = await getMessages(req.params.page, req.params.limit);
//     return res.json(messages);
// });

// app.use(express.static("static"));

// const server = createServer(app).listen(PORT, function (err) {
//   if (err) console.log(err);
//   else console.log("HTTP server on http://localhost:%s", PORT);
// });

import express from "express";
import Mongodb from "mongodb";
import multer from "multer";
import {dbo} from "./connection.mjs";
import User from "./models/User.mjs";
import Budget from "./models/Budget.mjs";
import Expense from "./models/Expense.mjs";
import { getData } from './excel.mjs';
import { MongoClient } from "mongodb"
import cron from 'node-cron';


import { createServer } from "http";

const PORT = 4000;
const app = express();

app.use(express.json());

// route to create and insert a new user
app.post("/createUser", async (req, res) => {
  try {
    const { username, email, password, total_amount, monthly_income } = req.body;
    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password,
      total_amount,
      monthly_income,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    console.log("This is the newUser: ", newUser);

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to create and insert a new expense
// app.post("/createExpense", async (req, res) => {
//   try {
//     const { user, description, amount, category, date } = req.body;
    
//     // Create a new expense instance
//     const newExpense = new Expense({
//       user,
//       description,
//       amount,
//       category,
//       date,
//     });

//     // Save the expense to the database
//     const savedExpense = await newExpense.save();

//     console.log("New Expense created: ", newExpense);

//     res.status(201).json(savedExpense);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// Import necessary modules
// const express = require('express');
// const axios = require('axios');


// Create an Express app
// const app = express();
// app.use(express.json());

// Define a route to handle the post request
app.post('/createExpense', async (req, res) => {
  try {
    getData();

    // Respond with a success message
    res.status(200).json({ message: 'Expenses uploaded successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Route to create and insert a new budget
app.post("/createBudget", async (req, res) => {
  try {
    const { user, category, amount, createdAt } = req.body;
    
    // Create a new budget instance
    const newBudget = new Budget({
      user,
      category,
      amount,
      createdAt,
    });

    // Save the budget to the database
    const savedBudget = await newBudget.save();

    console.log("New Budget created: ", newBudget);

    res.status(201).json(savedBudget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get all expenses for a specific user
app.get("/expenses/:userId", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    const userId = req.params.userId;
    const expenses = await Expense.find({ user: userId });
    // Create an object with aggregated amounts for each category
    const aggregatedExpenses = expenses.reduce((result, expense) => {
      const { category, amount } = expense;

      // If the category already exists, add the amount; otherwise, create a new entry
      result[category] = (result[category] || 0) + amount;

      return result;
    }, {});

    // Convert the aggregated object into an array of objects with [category_name]: [amount] format
    const formattedExpenses = Object.entries(aggregatedExpenses).map(([category, amount]) => ({
      [category]: amount,
    }));

    res.status(200).json(formattedExpenses);
    //console.log("These are the expences: ", expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

cron.schedule('*/10 * * * * *', async () => {
  getData();
});

const httpServer = createServer(app).listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
  
    // perform a database connection when server starts
    dbo.connectToServer((err) => {
      if (err) console.error(err);
    });
  });

  